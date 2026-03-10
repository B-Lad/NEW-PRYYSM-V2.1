/**
 * PrintOps MQTT Client
 * Connects to a local Raspberry Pi broker and streams
 * printer telemetry into Supabase Realtime.
 *
 * Run as a standalone Node.js process:
 *   node lib/mqtt-client.ts  (with ts-node)
 *   or compile: tsc && node dist/lib/mqtt-client.js
 */

import mqtt, { MqttClient, IClientOptions } from 'mqtt';
import { createClient } from '@supabase/supabase-js';

// ── CONFIG ───────────────────────────────────────────────────
const BROKER_URL  = process.env.MQTT_BROKER_URL  || 'mqtt://localhost:1883';
const MQTT_USER   = process.env.MQTT_USERNAME     || '';
const MQTT_PASS   = process.env.MQTT_PASSWORD     || '';
const TOPIC_PREFIX = 'printops/+/';

const SUPABASE_URL      = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY      = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// ── TYPES ────────────────────────────────────────────────────
interface PrinterStatus {
  status?:      'idle' | 'printing' | 'paused' | 'error';
  temp_nozzle?: number;
  temp_bed?:    number;
  progress?:    number;
  layer?:       number;
  total_layers?:number;
  fan_speed?:   number;
  error_msg?:   string;
}

// ── SUPABASE CLIENT ──────────────────────────────────────────
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── HELPERS ──────────────────────────────────────────────────
function parseTopic(topic: string): { machineIp: string; event: string } | null {
  // Topic format: printops/<machine-id-or-ip>/status|telemetry
  const parts = topic.split('/');
  if (parts.length < 3) return null;
  return { machineIp: parts[1], event: parts[2] };
}

async function getMachineId(ipOrId: string): Promise<string | null> {
  const { data } = await supabase
    .from('machines')
    .select('id')
    .or(`ip_address.eq.${ipOrId},id.eq.${ipOrId}`)
    .single();
  return data?.id ?? null;
}

async function upsertMachineStatus(machineId: string, payload: PrinterStatus) {
  const update: Record<string, unknown> = {};

  if (payload.status      != null) update.status          = payload.status;
  if (payload.temp_nozzle != null) update.nozzle_temp     = payload.temp_nozzle;
  if (payload.temp_bed    != null) update.bed_temp        = payload.temp_bed;
  if (payload.progress    != null) update.progress_pct    = payload.progress;
  if (payload.layer       != null) update.layer_current   = payload.layer;
  if (payload.total_layers!= null) update.layer_total     = payload.total_layers;
  if (payload.error_msg   != null) update.error_msg       = payload.error_msg;

  const { error } = await supabase
    .from('machines')
    .update(update)
    .eq('id', machineId);

  if (error) console.error('[Supabase]', error.message);
}

async function insertTelemetry(machineId: string, payload: PrinterStatus) {
  await supabase.from('telemetry').insert({
    machine_id:   machineId,
    nozzle_temp:  payload.temp_nozzle,
    bed_temp:     payload.temp_bed,
    progress_pct: payload.progress,
    layer:        payload.layer,
    fan_speed:    payload.fan_speed,
  });
}

// ── MAIN MQTT LOOP ───────────────────────────────────────────
export function startMQTTBridge(): MqttClient {
  const options: IClientOptions = {
    clientId:  `printops-bridge-${Math.random().toString(16).slice(2, 8)}`,
    username:  MQTT_USER || undefined,
    password:  MQTT_PASS || undefined,
    reconnectPeriod: 5000,
    connectTimeout:  10000,
    keepalive: 60,
  };

  const client = mqtt.connect(BROKER_URL, options);

  client.on('connect', () => {
    console.log(`[MQTT] Connected to ${BROKER_URL}`);
    client.subscribe([
      `${TOPIC_PREFIX}status`,
      `${TOPIC_PREFIX}telemetry`,
      `${TOPIC_PREFIX}error`,
    ], (err) => {
      if (err) console.error('[MQTT] Subscribe error:', err.message);
      else console.log('[MQTT] Subscribed to printops/+/{status,telemetry,error}');
    });
  });

  client.on('message', async (topic, buffer) => {
    try {
      const parsed = parseTopic(topic);
      if (!parsed) return;

      const payload: PrinterStatus = JSON.parse(buffer.toString());
      const machineId = await getMachineId(parsed.machineIp);
      if (!machineId) {
        console.warn(`[MQTT] Unknown machine: ${parsed.machineIp}`);
        return;
      }

      console.log(`[MQTT] ← ${topic}`, payload);

      if (parsed.event === 'status' || parsed.event === 'error') {
        await upsertMachineStatus(machineId, payload);
      }

      if (parsed.event === 'telemetry') {
        await insertTelemetry(machineId, payload);
      }
    } catch (err) {
      console.error('[MQTT] Message parse error:', err);
    }
  });

  client.on('error',       (err) => console.error('[MQTT] Error:', err.message));
  client.on('reconnect',   ()    => console.log('[MQTT] Reconnecting...'));
  client.on('disconnect',  ()    => console.log('[MQTT] Disconnected'));
  client.on('offline',     ()    => console.log('[MQTT] Offline'));

  return client;
}

// ── STANDALONE ENTRYPOINT ────────────────────────────────────
if (require.main === module) {
  console.log('[PrintOps MQTT Bridge] Starting...');
  const client = startMQTTBridge();
  process.on('SIGTERM', () => { client.end(); process.exit(0); });
  process.on('SIGINT',  () => { client.end(); process.exit(0); });
}

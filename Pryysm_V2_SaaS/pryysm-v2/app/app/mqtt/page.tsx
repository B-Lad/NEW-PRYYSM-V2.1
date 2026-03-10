'use client'
import { useState, useEffect, useRef } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Radio, Terminal, Wifi, WifiOff } from 'lucide-react'

interface LogLine { ts: string; type: 'info' | 'recv' | 'send' | 'error' | 'sys'; text: string }

const DEMO_MESSAGES: Omit<LogLine, 'ts'>[] = [
  { type: 'sys',  text: 'MQTT bridge starting…' },
  { type: 'info', text: 'Connecting to rpi.local:1883' },
  { type: 'error',text: 'Connection refused: broker unreachable' },
  { type: 'sys',  text: 'Retrying in 5s…' },
  { type: 'info', text: '[STUB] Simulating broker connection' },
  { type: 'recv', text: 'pryysm/m-01/status  {"status":"printing","temp_nozzle":215.3,"temp_bed":60.1,"progress":67}' },
  { type: 'recv', text: 'pryysm/m-02/status  {"status":"idle","temp_nozzle":26,"temp_bed":22}' },
  { type: 'recv', text: 'pryysm/m-03/status  {"status":"error","error_msg":"FEP membrane failure"}' },
  { type: 'send', text: 'pryysm/m-01/cmd  {"cmd":"get_status"}' },
  { type: 'recv', text: 'pryysm/m-01/telemetry  {"layer":185,"total_layers":274,"fan_speed":100,"eta_s":4290}' },
]

export default function MqttPage() {
  const [connected, setConnected] = useState(false)
  const [logs, setLogs] = useState<LogLine[]>([])
  const [cmd, setCmd] = useState('')
  const logRef = useRef<HTMLDivElement>(null)

  const now = () => new Date().toLocaleTimeString('en-US', { hour12: false })

  const addLog = (line: Omit<LogLine, 'ts'>) =>
    setLogs(prev => [...prev.slice(-200), { ...line, ts: now() }])

  const connect = () => {
    addLog({ type: 'sys', text: 'Connecting to rpi.local:1883…' })
    setTimeout(() => {
      addLog({ type: 'info', text: '[STUB] Broker connection simulated' })
      setConnected(true)
      // Replay demo messages
      DEMO_MESSAGES.forEach((m, i) => setTimeout(() => addLog(m), i * 500 + 300))
    }, 800)
  }

  const disconnect = () => {
    addLog({ type: 'sys', text: 'Disconnecting…' })
    setTimeout(() => { setConnected(false); addLog({ type: 'sys', text: 'Disconnected.' }) }, 300)
  }

  const sendCmd = () => {
    if (!cmd.trim()) return
    addLog({ type: 'send', text: cmd })
    setCmd('')
  }

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [logs])

  const TYPE_STYLE: Record<string, string> = {
    sys:   'text-[#b8b3c4]',
    info:  'text-[#1a5898]',
    recv:  'text-[#1a7048]',
    send:  'text-[#966010]',
    error: 'text-[#b83228]',
  }
  const TYPE_PREFIX: Record<string, string> = {
    sys: '···', info: 'INF', recv: '←  ', send: '→  ', error: 'ERR',
  }

  return (
    <div>
      <div className="mb-5">
        <div className="font-mono text-[9px] text-[#b8b3c4] tracking-[.14em] mb-1">DASHBOARD / MQTT</div>
        <h1 className="font-display font-extrabold text-[22px] tracking-tight text-[#1a1624]">MQTT Edge Console</h1>
        <p className="text-[12.5px] text-[#8a8499] font-light mt-1">Real-time printer telemetry bridge via Raspberry Pi broker</p>
      </div>

      <div className="grid grid-cols-12 gap-4">

        {/* Config + controls */}
        <div className="col-span-4 flex flex-col gap-4">
          <Card>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Radio size={14} color="#5b3fd4" strokeWidth={1.8} />
                <h3 className="font-display font-bold text-[13.5px] text-[#1a1624]">Broker Config</h3>
                <span className="ml-auto font-mono text-[8px] px-1.5 py-0.5 rounded bg-[#fef3e2] text-[#a85510] border border-[#a8551033]">STUB</span>
              </div>

              {[
                { l: 'Host', v: 'rpi.local' },
                { l: 'Port', v: '1883' },
                { l: 'Topic', v: 'pryysm/+/#' },
                { l: 'QoS', v: '1' },
              ].map(({ l, v }) => (
                <div key={l} className="mb-3">
                  <label className="font-mono text-[9px] text-[#8a8499] tracking-[.1em] uppercase block mb-1">{l}</label>
                  <input defaultValue={v} className="w-full px-3 py-2 rounded-[8px] border border-[#e8e4dd] bg-[#f0ede8] font-mono text-[12px] text-[#1a1624] focus:outline-none focus:border-[#5b3fd4]" />
                </div>
              ))}

              <div className="flex gap-2 mt-2">
                {!connected ? (
                  <Button variant="primary" className="flex-1 justify-center" onClick={connect}>
                    <Wifi size={12} /> Connect
                  </Button>
                ) : (
                  <Button variant="danger" className="flex-1 justify-center" onClick={disconnect}>
                    <WifiOff size={12} /> Disconnect
                  </Button>
                )}
              </div>

              {/* Status */}
              <div className={`mt-3 flex items-center gap-2 px-3 py-2 rounded-[8px] border ${connected ? 'bg-[#e6f7ef] border-[#1a704833]' : 'bg-[#fdecea] border-[#b8322833]'}`}>
                <span className={`w-[6px] h-[6px] rounded-full ${connected ? 'bg-[#1a7048] animate-breathe' : 'bg-[#b83228]'}`} />
                <span className={`font-mono text-[10px] font-semibold ${connected ? 'text-[#1a7048]' : 'text-[#b83228]'}`}>
                  {connected ? 'Connected · STUB mode' : 'Disconnected'}
                </span>
              </div>
            </div>
          </Card>

          {/* Subscriptions */}
          <Card>
            <div className="p-4">
              <h4 className="font-display font-bold text-[13px] text-[#1a1624] mb-3">Active Topics</h4>
              {['pryysm/m-01/#', 'pryysm/m-02/#', 'pryysm/m-03/#'].map(t => (
                <div key={t} className="flex items-center gap-2 mb-2 px-2.5 py-2 rounded-[8px] bg-[#f0ede8] border border-[#e8e4dd]">
                  <span className={`w-[5px] h-[5px] rounded-full ${connected ? 'bg-[#1a7048] animate-breathe' : 'bg-[#b8b3c4]'}`} />
                  <span className="font-mono text-[10.5px] text-[#4a4558] flex-1">{t}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Terminal */}
        <div className="col-span-8">
          <Card className="h-full flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#e8e4dd] bg-[#f0ede8]">
              <div className="flex items-center gap-2">
                <Terminal size={13} color="#5b3fd4" />
                <span className="font-display font-bold text-[13px] text-[#1a1624]">MQTT Log</span>
                <span className="font-mono text-[9px] text-[#8a8499]">{logs.length} events</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setLogs([])}>Clear</Button>
            </div>

            {/* Log output */}
            <div ref={logRef} className="flex-1 overflow-y-auto p-3 font-mono text-[11px] bg-[#1a1624] min-h-[380px] max-h-[460px]">
              {logs.length === 0 && (
                <div className="text-[#4a4558] text-center mt-8 text-[12px]">Connect to start receiving events…</div>
              )}
              {logs.map((l, i) => (
                <div key={i} className={`flex gap-2 mb-0.5 leading-[1.7] ${TYPE_STYLE[l.type]}`}>
                  <span className="text-[#4a4558] flex-shrink-0 select-none">{l.ts}</span>
                  <span className="flex-shrink-0 select-none">{TYPE_PREFIX[l.type]}</span>
                  <span className="break-all">{l.text}</span>
                </div>
              ))}
            </div>

            {/* Command input */}
            <div className="flex gap-2 p-3 border-t border-[#e8e4dd] bg-[#1a1624]">
              <span className="font-mono text-[11px] text-[#7dd4a0] self-center">$</span>
              <input
                value={cmd}
                onChange={e => setCmd(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendCmd()}
                disabled={!connected}
                placeholder="publish pryysm/m-01/cmd {&quot;cmd&quot;:&quot;pause&quot;}"
                className="flex-1 bg-transparent font-mono text-[11px] text-[#e0dce8] placeholder-[#4a4558] focus:outline-none disabled:opacity-40"
              />
              <Button variant="soft" size="sm" onClick={sendCmd} disabled={!connected}>Send</Button>
            </div>
          </Card>
        </div>

      </div>
    </div>
  )
}

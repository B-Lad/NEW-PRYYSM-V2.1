// ── Machine / Printer ────────────────────────────────────────
export type PrinterStatus = 'idle' | 'printing' | 'paused' | 'error' | 'offline'
export type PrinterType   = 'FDM' | 'SLA' | 'SLS' | 'MJF'

export interface Machine {
  id:               string
  user_id:          string
  name:             string
  type:             PrinterType
  ip_address:       string | null
  status:           PrinterStatus
  material:         string | null
  nozzle_temp:      number
  bed_temp:         number
  progress_pct:     number
  time_remaining_s: number
  current_job_id:   string | null
  layer_current:    number
  layer_total:      number
  error_msg:        string | null
  created_at:       string
  updated_at:       string
}

// ── Job ──────────────────────────────────────────────────────
export type JobStatus =
  | 'pending' | 'queued' | 'printing' | 'paused'
  | 'awaiting_clearance' | 'completed' | 'error' | 'cancelled'

export interface Job {
  id:          string
  user_id:     string
  machine_id:  string | null
  file_name:   string
  file_url:    string | null
  status:      JobStatus
  material:    string | null
  volume_cm3:  number | null
  price:       number | null
  infill_pct:  number
  quality:     'draft' | 'standard' | 'fine' | 'ultra'
  eta_seconds: number | null
  notes:       string | null
  created_at:  string
  updated_at:  string
  // joined
  machine?:    Pick<Machine, 'id' | 'name' | 'type'>
}

// ── Material / Spool ─────────────────────────────────────────
export interface Material {
  id:          string
  user_id:     string | null
  name:        string
  type:        string | null
  color:       string | null
  cost_per_g:  number
  is_global:   boolean
  created_at:  string
}

export interface Spool {
  id:            string
  user_id:       string
  material_id:   string
  brand:         string | null
  color_name:    string | null
  weight_g:      number
  remaining_g:   number
  lot_number:    string | null
  machine_id:    string | null
  created_at:    string
  material?:     Material
}

// ── Telemetry ─────────────────────────────────────────────────
export interface TelemetryPoint {
  id:          number
  machine_id:  string
  nozzle_temp: number | null
  bed_temp:    number | null
  progress_pct:number | null
  layer:       number | null
  fan_speed:   number | null
  recorded_at: string
}

// ── Maintenance ───────────────────────────────────────────────
export type MaintenanceStatus = 'open' | 'in_progress' | 'resolved'

export interface MaintenanceLog {
  id:          string
  machine_id:  string
  user_id:     string
  title:       string
  description: string | null
  status:      MaintenanceStatus
  scheduled_at:string | null
  resolved_at: string | null
  created_at:  string
  machine?:    Pick<Machine, 'id' | 'name'>
}

// ── Notification ──────────────────────────────────────────────
export interface Notification {
  id:         string
  user_id:    string
  type:       'error' | 'warning' | 'info' | 'success'
  title:      string
  body:       string | null
  read:       boolean
  created_at: string
}

// ── UI helpers ────────────────────────────────────────────────
export type StatusColor = 'green' | 'blue' | 'red' | 'amber' | 'violet' | 'grey'

export const STATUS_COLOR: Record<PrinterStatus | JobStatus, StatusColor> = {
  idle:               'blue',
  printing:           'green',
  paused:             'amber',
  error:              'red',
  offline:            'grey',
  pending:            'grey',
  queued:             'violet',
  awaiting_clearance: 'amber',
  completed:          'grey',
  cancelled:          'grey',
}

export const STATUS_LABEL: Record<PrinterStatus | JobStatus, string> = {
  idle:               'Idle',
  printing:           'Printing',
  paused:             'Paused',
  error:              'Error',
  offline:            'Offline',
  pending:            'Pending',
  queued:             'Queued',
  awaiting_clearance: 'Awaiting Clearance',
  completed:          'Done',
  cancelled:          'Cancelled',
}

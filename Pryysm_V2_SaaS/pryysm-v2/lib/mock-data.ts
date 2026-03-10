import type { Machine, Job, Spool, MaintenanceLog, Notification } from './types'

export const MOCK_MACHINES: Machine[] = [
  {
    id: 'm-01', user_id: 'demo', name: 'Ender 5 Pro', type: 'FDM',
    ip_address: '192.168.1.101', status: 'printing', material: 'PLA+',
    nozzle_temp: 215, bed_temp: 60, progress_pct: 67,
    time_remaining_s: 4320, current_job_id: 'j-01',
    layer_current: 184, layer_total: 274, error_msg: null,
    created_at: '', updated_at: '',
  },
  {
    id: 'm-02', user_id: 'demo', name: 'Bambu X1 Carbon', type: 'FDM',
    ip_address: '192.168.1.102', status: 'idle', material: 'PETG',
    nozzle_temp: 26, bed_temp: 22, progress_pct: 0,
    time_remaining_s: 0, current_job_id: null,
    layer_current: 0, layer_total: 0, error_msg: null,
    created_at: '', updated_at: '',
  },
  {
    id: 'm-03', user_id: 'demo', name: 'Elegoo Saturn 3', type: 'SLA',
    ip_address: '192.168.1.103', status: 'error', material: 'ABS-Like Resin',
    nozzle_temp: 0, bed_temp: 0, progress_pct: 43,
    time_remaining_s: 0, current_job_id: 'j-04',
    layer_current: 430, layer_total: 1000,
    error_msg: 'FEP membrane exposure failure — replace film',
    created_at: '', updated_at: '',
  },
]

export const MOCK_JOBS: Job[] = [
  {
    id: 'j-01', user_id: 'demo', machine_id: 'm-01',
    file_name: 'Bracket_assembly_v3.stl', file_url: null,
    status: 'printing', material: 'PLA+', volume_cm3: 48.2,
    price: 3.47, infill_pct: 20, quality: 'standard', eta_seconds: 4320, notes: null,
    created_at: new Date(Date.now() - 3600000).toISOString(), updated_at: '',
    machine: { id: 'm-01', name: 'Ender 5 Pro', type: 'FDM' },
  },
  {
    id: 'j-02', user_id: 'demo', machine_id: 'm-02',
    file_name: 'Gear_housing_rev2.stl', file_url: null,
    status: 'queued', material: 'PETG', volume_cm3: 72.1,
    price: 5.21, infill_pct: 30, quality: 'fine', eta_seconds: 7200, notes: null,
    created_at: new Date(Date.now() - 1800000).toISOString(), updated_at: '',
    machine: { id: 'm-02', name: 'Bambu X1 Carbon', type: 'FDM' },
  },
  {
    id: 'j-03', user_id: 'demo', machine_id: null,
    file_name: 'Cable_clip_set_x10.stl', file_url: null,
    status: 'pending', material: 'PLA+', volume_cm3: 18.6,
    price: 1.61, infill_pct: 15, quality: 'draft', eta_seconds: 2400, notes: null,
    created_at: new Date(Date.now() - 900000).toISOString(), updated_at: '',
  },
  {
    id: 'j-04', user_id: 'demo', machine_id: 'm-03',
    file_name: 'Miniature_base_v2.stl', file_url: null,
    status: 'error', material: 'ABS-Like Resin', volume_cm3: 22.3,
    price: 2.75, infill_pct: 100, quality: 'ultra', eta_seconds: null, notes: null,
    created_at: new Date(Date.now() - 5400000).toISOString(), updated_at: '',
    machine: { id: 'm-03', name: 'Elegoo Saturn 3', type: 'SLA' },
  },
  {
    id: 'j-05', user_id: 'demo', machine_id: 'm-01',
    file_name: 'Phone_dock_v1.stl', file_url: null,
    status: 'completed', material: 'PETG', volume_cm3: 55.8,
    price: 4.12, infill_pct: 20, quality: 'standard', eta_seconds: 0, notes: null,
    created_at: new Date(Date.now() - 86400000).toISOString(), updated_at: '',
    machine: { id: 'm-01', name: 'Ender 5 Pro', type: 'FDM' },
  },
]

export const MOCK_SPOOLS: Spool[] = [
  {
    id: 's-01', user_id: 'demo', material_id: 'mat-01',
    brand: 'Bambu Lab', color_name: 'Matte Black', weight_g: 1000, remaining_g: 340,
    lot_number: 'BL-2024-03A', machine_id: 'm-01',
    created_at: '',
    material: { id: 'mat-01', user_id: null, name: 'PLA+', type: 'FDM', color: '#222', cost_per_g: 0.03, is_global: true, created_at: '' },
  },
  {
    id: 's-02', user_id: 'demo', material_id: 'mat-02',
    brand: 'Polymaker', color_name: 'Translucent Blue', weight_g: 1000, remaining_g: 820,
    lot_number: 'PM-PETG-24B', machine_id: 'm-02',
    created_at: '',
    material: { id: 'mat-02', user_id: null, name: 'PETG', type: 'FDM', color: '#4CA5FF', cost_per_g: 0.04, is_global: true, created_at: '' },
  },
  {
    id: 's-03', user_id: 'demo', material_id: 'mat-07',
    brand: 'Elegoo', color_name: 'Water Washable Grey', weight_g: 500, remaining_g: 95,
    lot_number: null, machine_id: null,
    created_at: '',
    material: { id: 'mat-07', user_id: null, name: 'ABS-Like Resin', type: 'SLA', color: '#999', cost_per_g: 0.08, is_global: true, created_at: '' },
  },
]

export const MOCK_MAINTENANCE: MaintenanceLog[] = [
  {
    id: 'mn-01', machine_id: 'm-03', user_id: 'demo',
    title: 'Replace FEP film', description: 'Exposure failure detected — FEP membrane worn',
    status: 'open', scheduled_at: null, resolved_at: null,
    created_at: new Date().toISOString(),
    machine: { id: 'm-03', name: 'Elegoo Saturn 3' },
  },
  {
    id: 'mn-02', machine_id: 'm-01', user_id: 'demo',
    title: 'Nozzle cleaning',  description: 'Routine cold pull after 200h',
    status: 'resolved', scheduled_at: null, resolved_at: new Date(Date.now() - 86400000).toISOString(),
    created_at: new Date(Date.now() - 172800000).toISOString(),
    machine: { id: 'm-01', name: 'Ender 5 Pro' },
  },
]

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n-01', user_id: 'demo', type: 'error',   title: 'P-03 Error',         body: 'FEP membrane failure detected.',        read: false, created_at: new Date().toISOString() },
  { id: 'n-02', user_id: 'demo', type: 'warning', title: 'Low Filament',       body: 'Spool s-03 below 100g remaining.',      read: false, created_at: new Date(Date.now()-300000).toISOString() },
  { id: 'n-03', user_id: 'demo', type: 'success', title: 'Job Completed',      body: 'Phone_dock_v1.stl finished on P-01.',   read: true,  created_at: new Date(Date.now()-86400000).toISOString() },
]

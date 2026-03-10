'use client'
import { useState, useEffect } from 'react'
import { Printer, AlertTriangle } from 'lucide-react'
import Card from '@/components/ui/Card'
import StatusPill from '@/components/ui/StatusPill'
import ArcGauge from '@/components/ui/ArcGauge'
import Sparkline from '@/components/ui/Sparkline'
import Button from '@/components/ui/Button'
import { fmtSeconds } from '@/lib/utils'
import type { Machine, Job } from '@/lib/types'

interface Props { machine: Machine; job?: Job; delay?: number }

const ACCENT: Record<string, 'green' | 'blue' | 'red' | 'amber'> = {
  printing: 'green', idle: 'blue', error: 'red', paused: 'amber', offline: 'blue',
}
const ICON_BG: Record<string, string> = {
  printing: 'bg-[#e6f7ef] border-[#1a704833]',
  idle:     'bg-[#e8f2fc] border-[#1a589833]',
  error:    'bg-[#fdecea] border-[#b8322833]',
  paused:   'bg-[#fef3e2] border-[#a8551033]',
  offline:  'bg-[#f0ede8] border-[#e8e4dd]',
}
const ICON_COLOR: Record<string, string> = {
  printing: '#1a7048', idle: '#1a5898', error: '#b83228', paused: '#a85510', offline: '#8a8499',
}
const GAUGE_COLOR: Record<string, string> = {
  printing: '#a85510', idle: '#1a5898', error: '#b83228', paused: '#a85510', offline: '#b8b3c4',
}

// Simulate temp history for demo
function genTempHistory(base: number, jitter = 3) {
  return Array.from({ length: 16 }, (_, i) => base + Math.sin(i * 0.5) * jitter + (Math.random() - 0.5))
}

export default function PrinterCard({ machine: m, job, delay = 0 }: Props) {
  const [nozzle, setNozzle] = useState(m.nozzle_temp)
  const [bed,    setBed   ] = useState(m.bed_temp)
  const [prog,   setProg  ] = useState(m.progress_pct)
  const [tempHistory, setTempHistory] = useState<number[]>(genTempHistory(m.nozzle_temp))
  const delayClass = ['','delay-1','delay-2','delay-3','delay-4'][delay] ?? ''

  useEffect(() => {
    if (m.status !== 'printing') return
    const id = setInterval(() => {
      setNozzle(v => +(v + (Math.random() - 0.5) * 0.8).toFixed(1))
      setBed(v    => +(v + (Math.random() - 0.5) * 0.3).toFixed(1))
      setProg(v   => Math.min(v + 0.08, 99))
      setTempHistory(prev => [...prev.slice(1), m.nozzle_temp + (Math.random() - 0.5) * 4])
    }, 2000)
    return () => clearInterval(id)
  }, [m.status, m.nozzle_temp])

  const statusCol = ICON_COLOR[m.status] ?? '#8a8499'
  const gaugeCol  = GAUGE_COLOR[m.status] ?? '#8a8499'

  return (
    <Card accent={ACCENT[m.status] ?? 'none'} className={`animate-float-in ${delayClass}`}>
      <div className="p-4">

        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className={`w-[30px] h-[30px] rounded-[8px] flex items-center justify-center flex-shrink-0 border ${ICON_BG[m.status]}`}>
              <Printer size={13} color={statusCol} strokeWidth={1.8} />
            </div>
            <div>
              <div className="font-display font-bold text-[13px] text-[#1a1624] leading-tight">{m.name}</div>
              <div className="font-mono text-[8px] text-[#8a8499] mt-0.5 tracking-[.06em]">{m.id.toUpperCase()} · {m.type}</div>
            </div>
          </div>

          {/* Gauges */}
          <div className="flex gap-2 flex-shrink-0">
            {m.type === 'FDM' ? (
              <>
                <div className="flex flex-col items-center gap-0.5">
                  <ArcGauge value={nozzle} max={280} color={gaugeCol} label={`${Math.round(nozzle)}°`} />
                  <span className="font-mono text-[7px] text-[#b8b3c4] uppercase tracking-[.08em]">nozzle</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <ArcGauge value={bed} max={120} color="#966010" label={`${Math.round(bed)}°`} />
                  <span className="font-mono text-[7px] text-[#b8b3c4] uppercase tracking-[.08em]">bed</span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-0.5">
                <ArcGauge value={prog} max={100} color={gaugeCol} label={`${Math.round(prog)}%`} />
                <span className="font-mono text-[7px] text-[#b8b3c4] uppercase tracking-[.08em]">expos.</span>
              </div>
            )}
          </div>
        </div>

        {/* Status pill */}
        <StatusPill status={m.status} />

        {/* Error banner */}
        {m.status === 'error' && m.error_msg && (
          <div className="mt-3 flex items-start gap-2 px-2.5 py-2 rounded-[9px] bg-[#fdecea] border border-[#b8322833]">
            <AlertTriangle size={12} color="#b83228" className="flex-shrink-0 mt-0.5" strokeWidth={2} />
            <p className="font-mono text-[9.5px] text-[#b83228] leading-snug">{m.error_msg}</p>
          </div>
        )}

        {/* Active job */}
        {job && m.status !== 'idle' ? (
          <div className="mt-3 flex items-center gap-2 px-2.5 py-2 rounded-[9px] bg-[#f0ede8] border border-[#e8e4dd]">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#966010" strokeWidth="1.9" strokeLinecap="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
            <div className="flex-1 min-w-0">
              <div className="text-[11.5px] font-semibold text-[#1a1624] truncate">{job.file_name}</div>
              <div className="font-mono text-[8.5px] text-[#8a8499] mt-0.5">
                {job.material}
                {m.status === 'printing' && ` · Layer ${m.layer_current} / ${m.layer_total}`}
              </div>
            </div>
            {m.status === 'printing' && (
              <span className="font-mono text-[10px] font-bold text-[#1a7048] flex-shrink-0">
                {fmtSeconds(m.time_remaining_s)}
              </span>
            )}
          </div>
        ) : m.status === 'idle' ? (
          <div className="mt-3 p-3 rounded-[9px] text-center border-[1.5px] border-dashed border-[#d8d3ca] bg-[#f0ede8]">
            <p className="text-[11px] text-[#8a8499] mb-2">No active job · {m.material ?? 'No material'} loaded</p>
            <Button variant="soft" size="sm" className="w-full justify-center text-[12px]">+ Assign Job</Button>
          </div>
        ) : null}

        {/* Progress bar */}
        {m.status === 'printing' && (
          <div className="mt-3">
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-[9.5px] text-[#8a8499]">Print progress</span>
              <span className="font-mono text-[13px] font-bold text-[#1a7048]">{Math.round(prog)}%</span>
            </div>
            <div className="h-[6px] rounded-full bg-[#f0ede8] border border-[#e8e4dd] overflow-hidden">
              <div className="progress-fill" style={{ width: `${prog}%` }} />
            </div>
          </div>
        )}

        {/* Error actions */}
        {m.status === 'error' && (
          <div className="mt-3 flex gap-2">
            <Button variant="danger" size="sm" className="flex-1 justify-center">Clear Error</Button>
            <Button variant="ghost"  size="sm" className="flex-1 justify-center">View Log</Button>
          </div>
        )}

        {/* Temp sparkline */}
        <div>
          <div className="font-mono text-[8px] text-[#b8b3c4] tracking-[.09em] mt-3 mb-1">TEMP HISTORY</div>
          <Sparkline data={tempHistory} color={statusCol} width={220} height={22} />
        </div>
      </div>
    </Card>
  )
}

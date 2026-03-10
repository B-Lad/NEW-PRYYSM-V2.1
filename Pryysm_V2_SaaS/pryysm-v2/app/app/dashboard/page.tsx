'use client'
import { MOCK_MACHINES, MOCK_JOBS } from '@/lib/mock-data'
import StatCard from '@/components/fleet/StatCard'
import PrinterCard from '@/components/fleet/PrinterCard'
import FleetHealthDonut from '@/components/fleet/FleetHealthDonut'
import JobTable from '@/components/queue/JobTable'
import Card from '@/components/ui/Card'
import { fmtPrice } from '@/lib/utils'

export default function DashboardPage() {
  const machines  = MOCK_MACHINES
  const jobs      = MOCK_JOBS
  const printing  = machines.filter(m => m.status === 'printing').length
  const errors    = machines.filter(m => m.status === 'error').length
  const queued    = jobs.filter(j => ['queued','pending'].includes(j.status)).length
  const revenue   = jobs.filter(j => j.status === 'completed').reduce((s, j) => s + (j.price ?? 0), 0)
  const today     = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div>
      {/* Page header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="font-mono text-[9px] text-[#b8b3c4] tracking-[.14em] mb-1">DASHBOARD / FLEET OVERVIEW</div>
          <div className="flex items-center gap-3">
            <h1 className="font-display font-extrabold text-[22px] tracking-tight text-[#1a1624]">Fleet Overview</h1>
            <span className="font-mono text-[9.5px] font-medium px-2 py-0.5 rounded-[5px] bg-[#ede9fd] text-[#5b3fd4] border border-[#5b3fd433]">
              {machines.length} machines
            </span>
          </div>
          <p className="text-[12.5px] text-[#8a8499] font-light mt-1">{today}</p>
        </div>
        <div className="flex gap-2">
          {errors > 0 && (
            <a href="/app/queue"
              className="flex items-center gap-1.5 px-3 py-[7px] rounded-[9px] bg-[#fdecea] text-[#b83228] text-[12.5px] font-medium border border-[#b8322833] hover:bg-[#f9d9d7] transition-colors shadow-[0_1px_3px_rgba(26,22,36,.06)]">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#b83228" strokeWidth="2" strokeLinecap="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              {errors} Error{errors > 1 ? 's' : ''}
            </a>
          )}
        </div>
      </div>

      {/* 12-col bento grid */}
      <div className="grid grid-cols-12 gap-3">

        {/* Stat cards — 3 cols each */}
        <div className="col-span-3">
          <StatCard label="Active Printers" value={`${printing} / ${machines.length}`} sub={`${printing} printing now`}
            color="#5b3fd4" sparkData={[1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,1]} delay={1} />
        </div>
        <div className="col-span-3">
          <StatCard label="Queue Depth" value={String(queued)} sub="2 need assignment"
            color="#1a5898" sparkData={[2,3,4,3,5,4,6,5,4,4,4,5,4,4,4,4]} delay={2} />
        </div>
        <div className="col-span-3">
          <StatCard label="Revenue Today" value={fmtPrice(13.04)} sub="↑ 14% vs yesterday"
            color="#966010" sparkData={[4,5,6,5,7,8,7,9,8,10,11,13,13,13,13,13]} delay={3} />
        </div>
        <div className="col-span-3">
          <StatCard label="Fleet Errors" value={String(errors)} sub={errors > 0 ? 'P-03 needs attention' : 'All clear'}
            color="#b83228" sparkData={[0,0,1,0,0,1,0,0,0,0,0,1,1,1,1,1]} delay={4} />
        </div>

        {/* Printer cards — 4 cols each */}
        {machines.map((m, i) => (
          <div key={m.id} className="col-span-4">
            <PrinterCard
              machine={m}
              job={jobs.find(j => j.id === m.current_job_id)}
              delay={i + 1}
            />
          </div>
        ))}

        {/* Job table — 8 cols */}
        <div className="col-span-8">
          <JobTable jobs={jobs} />
        </div>

        {/* Fleet health + system — 4 cols */}
        <div className="col-span-4 flex flex-col gap-3">
          <FleetHealthDonut machines={machines} />

          {/* System card */}
          <Card>
            <div className="p-4">
              <h3 className="font-display font-bold text-[13.5px] text-[#1a1624] mb-3">System</h3>
              {/* KPI band */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                {[
                  { n: '7',    lbl: 'JOBS TODAY', c: '#5b3fd4' },
                  { n: '14d',  lbl: 'UPTIME',     c: '#1a7048' },
                ].map(({ n, lbl, c }) => (
                  <div key={lbl} className="p-2 rounded-[9px] bg-[#f0ede8] border border-[#e8e4dd] text-center">
                    <div className="font-display font-extrabold text-[18px] leading-none" style={{ color: c }}>{n}</div>
                    <div className="font-mono text-[8px] text-[#8a8499] tracking-[.08em] mt-1">{lbl}</div>
                  </div>
                ))}
              </div>
              {[
                { l: 'Avg. Nozzle Temp', v: '119°C',       c: '#a85510' },
                { l: 'Filament Used',    v: '1.2 kg',       c: '#966010' },
                { l: 'Revenue Today',    v: '$13.04',        c: '#1a7048' },
                { l: 'MQTT Status',      v: 'Disconnected',  c: '#b83228' },
              ].map(({ l, v, c }) => (
                <div key={l} className="flex justify-between items-center py-1.5 border-b border-[#f0ede8] last:border-0 text-[12px]">
                  <span className="text-[#8a8499]">{l}</span>
                  <span className="font-mono text-[11px] font-bold" style={{ color: c }}>{v}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#e8e4dd]">
        <div className="flex items-center gap-2.5">
          <span className="font-display font-extrabold text-[13.5px] text-[#1a1624]">Pryysm</span>
          <span className="font-mono text-[9px] text-[#b8b3c4]">v2.0.0 · Next.js 14 + Supabase + MQTT</span>
        </div>
        <div className="flex gap-4">
          {['Docs', 'API Reference', 'MQTT Guide', 'Deploy ↗'].map(l => (
            <a key={l} className="font-mono text-[9px] text-[#b8b3c4] hover:text-[#5b3fd4] transition-colors cursor-pointer">{l}</a>
          ))}
        </div>
      </div>
    </div>
  )
}

'use client'
import { useState } from 'react'
import { MOCK_JOBS, MOCK_MACHINES } from '@/lib/mock-data'
import JobTable from '@/components/queue/JobTable'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import StatusPill from '@/components/ui/StatusPill'
import { fmtPrice, fmtSeconds, timeAgo } from '@/lib/utils'
import { Plus, RefreshCw } from 'lucide-react'

const STATUS_COUNTS = (jobs: typeof MOCK_JOBS) => ({
  All:      jobs.length,
  Active:   jobs.filter(j => ['printing','queued','paused'].includes(j.status)).length,
  Pending:  jobs.filter(j => j.status === 'pending').length,
  Done:     jobs.filter(j => ['completed','cancelled'].includes(j.status)).length,
  Error:    jobs.filter(j => j.status === 'error').length,
})

export default function QueuePage() {
  const jobs     = MOCK_JOBS
  const machines = MOCK_MACHINES
  const counts   = STATUS_COUNTS(jobs)

  return (
    <div>
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="font-mono text-[9px] text-[#b8b3c4] tracking-[.14em] mb-1">DASHBOARD / JOB QUEUE</div>
          <h1 className="font-display font-extrabold text-[22px] tracking-tight text-[#1a1624]">Job Queue</h1>
          <p className="text-[12.5px] text-[#8a8499] font-light mt-1">Manage and track all print jobs across your fleet</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost"><RefreshCw size={13} />Refresh</Button>
          <Button variant="primary" className="flex items-center gap-1.5"><Plus size={13} strokeWidth={2.5} />New Job</Button>
        </div>
      </div>

      {/* Summary chips */}
      <div className="flex gap-3 mb-5 flex-wrap">
        {Object.entries(counts).map(([label, count]) => (
          <div key={label} className="flex items-center gap-2 px-3 py-1.5 rounded-[9px] bg-white border border-[#e8e4dd] shadow-[0_1px_3px_rgba(26,22,36,.06)]">
            <span className="text-[12px] text-[#4a4558] font-medium">{label}</span>
            <span className="font-mono text-[11px] font-bold text-[#1a1624]">{count}</span>
          </div>
        ))}
      </div>

      {/* Main table */}
      <div className="mb-5">
        <JobTable jobs={jobs} />
      </div>

      {/* Printer assignment grid */}
      <div className="grid grid-cols-3 gap-3">
        {machines.map(m => {
          const activeJob = jobs.find(j => j.id === m.current_job_id)
          const queuedForMachine = jobs.filter(j => j.machine_id === m.id && j.status === 'queued')
          return (
            <Card key={m.id} accent={m.status === 'error' ? 'red' : m.status === 'printing' ? 'green' : 'blue'}>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-display font-bold text-[13px] text-[#1a1624]">{m.name}</div>
                    <div className="font-mono text-[8px] text-[#8a8499] mt-0.5">{m.id.toUpperCase()} · {m.type}</div>
                  </div>
                  <StatusPill status={m.status} />
                </div>

                {activeJob ? (
                  <div className="text-[11.5px] text-[#4a4558] truncate font-medium mb-1">{activeJob.file_name}</div>
                ) : (
                  <div className="text-[11px] text-[#8a8499] italic mb-1">No active job</div>
                )}

                {m.status === 'printing' && (
                  <div className="mt-2">
                    <div className="h-[5px] rounded-full bg-[#f0ede8] overflow-hidden border border-[#e8e4dd]">
                      <div className="progress-fill" style={{ width: `${m.progress_pct}%` }} />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="font-mono text-[9px] text-[#8a8499]">{m.progress_pct}%</span>
                      <span className="font-mono text-[9px] text-[#1a7048]">{fmtSeconds(m.time_remaining_s)} left</span>
                    </div>
                  </div>
                )}

                {queuedForMachine.length > 0 && (
                  <div className="mt-2 font-mono text-[9px] text-[#5b3fd4]">
                    {queuedForMachine.length} job{queuedForMachine.length > 1 ? 's' : ''} queued
                  </div>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

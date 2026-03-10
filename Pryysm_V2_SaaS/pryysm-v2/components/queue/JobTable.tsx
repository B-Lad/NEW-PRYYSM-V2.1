'use client'
import { useState } from 'react'
import { FileBox } from 'lucide-react'
import StatusPill from '@/components/ui/StatusPill'
import { fmtPrice, fmtSeconds, timeAgo } from '@/lib/utils'
import type { Job } from '@/lib/types'

interface Props { jobs: Job[] }

const TABS = ['All', 'Active', 'Done'] as const
type Tab = typeof TABS[number]

function filterJobs(jobs: Job[], tab: Tab) {
  if (tab === 'Active') return jobs.filter(j => ['printing', 'queued', 'paused', 'awaiting_clearance'].includes(j.status))
  if (tab === 'Done')   return jobs.filter(j => ['completed', 'cancelled'].includes(j.status))
  return jobs
}

export default function JobTable({ jobs }: Props) {
  const [tab, setTab] = useState<Tab>('All')
  const visible = filterJobs(jobs, tab)

  return (
    <div className="bg-white border border-[#e8e4dd] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(26,22,36,.06),0_4px_14px_rgba(26,22,36,.07)]">
      {/* Header */}
      <div className="flex items-center justify-between px-[18px] py-3 border-b border-[#e8e4dd]
        bg-gradient-to-b from-[#f0ede8] to-transparent">
        <div className="flex items-center gap-2 font-display font-bold text-[13.5px] text-[#1a1624]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5b3fd4" strokeWidth="1.9" strokeLinecap="round">
            <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
            <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
          Job Queue
          <span className="font-mono text-[9.5px] font-medium px-2 py-0.5 rounded-[5px] bg-[#ede9fd] text-[#5b3fd4] border border-[#5b3fd433]">
            {jobs.length} jobs
          </span>
        </div>
        <div className="flex gap-1">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-1 rounded-[7px] font-body text-[11.5px] transition-all duration-150 ${
                tab === t
                  ? 'bg-white text-[#5b3fd4] font-semibold shadow-[0_1px_3px_rgba(26,22,36,.06)] border border-[#e8e4dd]'
                  : 'text-[#8a8499] hover:text-[#4a4558]'
              }`}>{t}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {['File', 'Status', 'Printer', 'Material', 'Price', 'Added'].map(h => (
              <th key={h} className="px-4 py-2 text-left font-mono text-[8px] text-[#b8b3c4] tracking-[.1em] uppercase font-medium bg-[#f0ede8] border-b border-[#e8e4dd]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visible.map((j, i) => (
            <tr key={j.id}
              className={`border-b border-[rgba(26,22,36,.04)] cursor-pointer transition-colors hover:bg-[#f0ede8] ${i === visible.length - 1 ? 'border-b-0' : ''}`}>
              <td className="px-4 py-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-[7px] flex-shrink-0 bg-[#fdf3e3] border border-[#96601033] flex items-center justify-center">
                    <FileBox size={11} color="#966010" strokeWidth={1.9} />
                  </div>
                  <span className="text-[12.5px] font-semibold text-[#1a1624] max-w-[200px] truncate">{j.file_name}</span>
                </div>
              </td>
              <td className="px-4 py-2.5"><StatusPill status={j.status} /></td>
              <td className="px-4 py-2.5">
                <span className="font-mono text-[10.5px] text-[#4a4558] font-medium">
                  {j.machine?.name ?? <span className="text-[#b8b3c4] italic">Unassigned</span>}
                </span>
              </td>
              <td className="px-4 py-2.5">
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-[5px] bg-[#f0ede8] text-[#4a4558] border border-[#e8e4dd]">
                  {j.material ?? '—'}
                </span>
              </td>
              <td className="px-4 py-2.5">
                <span className="font-mono text-[12.5px] font-bold text-[#966010]">{fmtPrice(j.price)}</span>
              </td>
              <td className="px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#8a8499]">{timeAgo(j.created_at)}</span>
              </td>
            </tr>
          ))}
          {visible.length === 0 && (
            <tr><td colSpan={6} className="px-4 py-8 text-center text-[12px] text-[#8a8499]">No jobs in this view</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

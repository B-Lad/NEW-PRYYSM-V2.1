'use client'
import type { Machine } from '@/lib/types'
import Card from '@/components/ui/Card'

interface Props { machines: Machine[] }

const COL = { printing: '#1a7048', idle: '#1a5898', error: '#b83228', paused: '#a85510', offline: '#b8b3c4' }

export default function FleetHealthDonut({ machines }: Props) {
  const counts = machines.reduce((acc, m) => {
    acc[m.status] = (acc[m.status] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  const total = machines.length || 1
  const segs = Object.entries(counts).map(([status, v]) => ({ status, v, col: COL[status as keyof typeof COL] ?? '#b8b3c4' }))

  const cx = 42, cy = 42, r = 26, C = 2 * Math.PI * r
  let offset = -(C * 0.25)
  const circles = segs.map(({ v, col, status }) => {
    const d = (v / total) * C
    const el = (
      <circle key={status} cx={cx} cy={cy} r={r} fill="none" stroke={col} strokeWidth={11}
        strokeDasharray={`${d - 2} ${C}`} strokeDashoffset={-offset}
        style={{ filter: `drop-shadow(0 1px 3px ${col}44)` }}
      />
    )
    offset += d
    return el
  })

  return (
    <Card>
      <div className="p-4">
        <h3 className="font-display font-bold text-[13.5px] text-[#1a1624] mb-3">Fleet Health</h3>
        <div className="flex items-center gap-4">
          <svg width="84" height="84" viewBox="0 0 84 84">
            {circles}
            <circle cx={cx} cy={cy} r={18} fill="white" />
            <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle"
              fontFamily="'Bricolage Grotesque',sans-serif" fontSize={13} fontWeight={800} fill="#1a1624">
              {total}
            </text>
          </svg>
          <div className="flex flex-col gap-2 flex-1">
            {segs.map(({ status, v, col }) => (
              <div key={status} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-[3px] flex-shrink-0" style={{ background: col }} />
                <span className="text-[12px] text-[#4a4558] flex-1 capitalize">{status}</span>
                <span className="font-mono text-[12px] font-bold" style={{ color: col }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

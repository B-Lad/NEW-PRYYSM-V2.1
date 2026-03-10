'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, ListOrdered, Upload, Radio,
  BarChart2, Settings, Printer, Wrench
} from 'lucide-react'
import { MOCK_MACHINES } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const NAV = [
  { label: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
  { label: 'Job Queue',  href: '/app/queue',     icon: ListOrdered },
  { label: 'Upload',     href: '/app/upload',    icon: Upload },
  { label: 'MQTT',       href: '/app/mqtt',      icon: Radio },
  { label: 'Analytics',  href: '/app/analytics', icon: BarChart2 },
  { label: 'Settings',   href: '/app/settings',  icon: Settings },
]

const STATUS_DOT: Record<string, string> = {
  printing: 'bg-[#1a7048]',
  idle:     'bg-[#1a5898]',
  error:    'bg-[#b83228]',
  paused:   'bg-[#a85510]',
  offline:  'bg-[#b8b3c4]',
}

export default function Sidebar() {
  const path = usePathname()

  return (
    <aside className="w-[196px] flex-shrink-0 bg-white border-r border-[#e8e4dd]
      flex flex-col py-3 px-2.5 gap-0.5
      sticky top-14 h-[calc(100vh-56px)] overflow-y-auto">

      {NAV.map(({ label, href, icon: Icon }) => {
        const active = path.startsWith(href)
        return (
          <Link key={href} href={href}
            className={cn(
              'flex items-center gap-2.5 px-2.5 py-2 rounded-[9px]',
              'font-body text-[12.5px] transition-all duration-150',
              active
                ? 'bg-[rgba(91,63,212,.10)] text-[#5b3fd4] font-semibold shadow-[inset_2px_0_0_#5b3fd4]'
                : 'text-[#8a8499] hover:bg-[#f0ede8] hover:text-[#4a4558]',
            )}>
            <Icon size={14} strokeWidth={active ? 2 : 1.7} />
            {label}
          </Link>
        )
      })}

      <div className="flex-1" />

      {/* Fleet mini-list */}
      <div className="border-t border-[#e8e4dd] mt-2 pt-2">
        <div className="font-mono text-[8px] text-[#b8b3c4] tracking-[.13em] px-1 mb-1.5">FLEET</div>

        {MOCK_MACHINES.map(m => (
          <div key={m.id} className="flex items-center gap-2 px-2.5 py-2 rounded-[9px] cursor-pointer hover:bg-[#f0ede8] border border-transparent hover:border-[#e8e4dd] transition-all mb-1">
            {/* Dot with ping for printing */}
            <div className="relative w-2 h-2 flex-shrink-0 flex items-center justify-center">
              {m.status === 'printing' && (
                <span className={cn('absolute inset-[-2px] rounded-full animate-ping2 opacity-40', STATUS_DOT[m.status])} />
              )}
              <span className={cn('w-[7px] h-[7px] rounded-full', STATUS_DOT[m.status] ?? 'bg-[#b8b3c4]')} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-semibold text-[#1a1624] truncate">{m.name}</div>
              <div className="font-mono text-[8px] text-[#8a8499]">{m.id.toUpperCase()} · {m.type}</div>
            </div>
            {m.status === 'printing' && (
              <span className="font-mono text-[9px] font-bold text-[#1a7048]">{m.progress_pct}%</span>
            )}
          </div>
        ))}
      </div>

      {/* MQTT stub box */}
      <div className="mt-2 p-2.5 rounded-[10px] bg-[#f0ede8] border border-[#e8e4dd]">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold text-[#4a4558]">MQTT Edge</span>
          <span className="font-mono text-[8px] px-1.5 py-0.5 rounded bg-[#fef3e2] text-[#a85510] border border-[#a8551033]">STUB</span>
        </div>
        <div className="font-mono text-[9px] text-[#8a8499] leading-[1.9]">
          rpi.local<span className="text-[#b8b3c4]">:1883</span><br/>
          <span className="text-[#a85510]">disconnected</span>
        </div>
        <div className="mt-1.5 px-2 py-1.5 rounded-[7px] bg-[#1a1624]">
          <span className="font-mono text-[9px]">
            <span className="text-[#7dd4a0]">$ </span>
            <span className="text-[#b8c4d0]">mqtt-bridge --start</span>
            <span className="text-[#b49ef7] animate-cursor">▌</span>
          </span>
        </div>
      </div>
    </aside>
  )
}

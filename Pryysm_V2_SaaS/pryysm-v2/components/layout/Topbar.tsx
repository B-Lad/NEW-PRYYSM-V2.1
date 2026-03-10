'use client'
import { useState, useEffect } from 'react'
import { Bell, Plus } from 'lucide-react'
import { MOCK_NOTIFICATIONS } from '@/lib/mock-data'

export default function Topbar() {
  const [time, setTime] = useState('')
  const unread = MOCK_NOTIFICATIONS.filter(n => !n.read).length

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between h-14 px-6
      bg-white/93 backdrop-blur-xl border-b border-[#e8e4dd]
      shadow-[0_1px_0_rgba(26,22,36,.04),0_1px_3px_rgba(26,22,36,.06)]">

      {/* Logo */}
      <div className="flex items-center gap-2.5 flex-shrink-0">
        <div className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center flex-shrink-0
          bg-gradient-to-br from-[#2d1f6e] via-[#1e4060] to-[#0f3020]
          shadow-[0_2px_8px_rgba(91,63,212,.22),0_0_0_1px_rgba(91,63,212,.14)]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d4b896" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
          </svg>
        </div>
        <div>
          <div className="font-display font-extrabold text-[18px] tracking-tight text-gradient-vi leading-none">Pryysm</div>
          <div className="font-mono text-[7.5px] text-[#b8b3c4] tracking-[.14em] mt-0.5">3D FLEET CONTROL</div>
        </div>
      </div>

      {/* Nav pills */}
      <nav className="flex gap-px p-[3px] bg-[#f0ede8] rounded-[10px] border border-[#e8e4dd]">
        {['Dashboard','Queue','Upload','MQTT','Analytics'].map((label, i) => (
          <a key={label}
            href={`/app/${label.toLowerCase()}`}
            className={`px-[15px] py-[5px] rounded-[8px] font-body font-medium text-[12.5px] transition-all duration-150
              ${i === 0 ? 'bg-white text-[#5b3fd4] shadow-[0_1px_4px_rgba(26,22,36,.10),0_0_0_1px_#e8e4dd]' : 'text-[#8a8499] hover:bg-white/60 hover:text-[#4a4558]'}`}
          >
            {label}
          </a>
        ))}
      </nav>

      {/* Right */}
      <div className="flex items-center gap-2.5 flex-shrink-0">
        {/* Live badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#e6f7ef] border border-[#1a704833]">
          <span className="w-[5px] h-[5px] rounded-full bg-[#1a7048] animate-breathe" />
          <span className="font-mono text-[9px] font-semibold tracking-[.1em] text-[#1a7048]">LIVE</span>
        </div>

        {/* Clock */}
        <span className="font-mono text-[11px] text-[#8a8499] tracking-wider tabular-nums">{time}</span>

        {/* Notifications */}
        <button className="relative w-8 h-8 rounded-[9px] bg-[#fdecea] border border-[#b8322833] flex items-center justify-center hover:bg-[#f9d9d7] transition-colors">
          <Bell size={13} color="#b83228" strokeWidth={2} />
          {unread > 0 && <span className="absolute top-[7px] right-[7px] w-[5px] h-[5px] rounded-full bg-[#b83228]" />}
        </button>

        {/* New Job shortcut */}
        <a href="/app/upload" className="flex items-center gap-1.5 px-3 py-[6px] rounded-[9px]
          bg-gradient-to-br from-[#5b3fd4] to-[#7c5af5] text-white text-[12px] font-semibold
          shadow-[0_2px_8px_rgba(91,63,212,.28)] hover:shadow-[0_4px_16px_rgba(91,63,212,.38)] transition-all">
          <Plus size={12} strokeWidth={2.5} />
          New Job
        </a>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-[9px] bg-gradient-to-br from-[#5b3fd4] to-[#8b6ef5] flex items-center justify-center
          font-display text-[12px] font-bold text-white cursor-pointer hover:scale-105 transition-transform
          shadow-[0_2px_8px_rgba(91,63,212,.28)]">
          OP
        </div>
      </div>
    </header>
  )
}

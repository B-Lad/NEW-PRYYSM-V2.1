'use client'
import { useState } from 'react'
import Button from '@/components/ui/Button'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [pass,  setPass ] = useState('')
  const [loading, setLoad] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoad(true)
    await new Promise(r => setTimeout(r, 600))
    window.location.href = '/app/dashboard'
  }

  return (
    <div className="min-h-screen bg-[#f5f3ef] flex items-center justify-center p-4"
      style={{ background: 'radial-gradient(ellipse 60% 40% at 60% 0%, rgba(91,63,212,.05) 0%, transparent 70%), #f5f3ef' }}>
      <div className="w-full max-w-[380px]">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-[14px] flex items-center justify-center mb-3
            bg-gradient-to-br from-[#2d1f6e] via-[#1e4060] to-[#0f3020]
            shadow-[0_4px_16px_rgba(91,63,212,.3)]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d4b896" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
          </div>
          <h1 className="font-display font-extrabold text-[26px] tracking-tight text-[#1a1624]">Pryysm</h1>
          <p className="font-mono text-[9px] text-[#b8b3c4] tracking-[.16em] mt-0.5">3D FLEET CONTROL</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#e8e4dd] rounded-[16px] p-7 shadow-[0_4px_24px_rgba(26,22,36,.10)]">
          <h2 className="font-display font-bold text-[16px] text-[#1a1624] mb-1">Sign in</h2>
          <p className="text-[12.5px] text-[#8a8499] mb-5">Enter your credentials to access your fleet</p>

          {/* Demo shortcut */}
          <a href="/app/dashboard"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-[9px] mb-4
            bg-[#ede9fd] text-[#5b3fd4] border border-[#5b3fd433] font-semibold text-[13px]
            hover:bg-[#e0d9f9] transition-colors">
            🚀 Continue as Demo User
          </a>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 h-px bg-[#e8e4dd]"></div>
            <span className="font-mono text-[9px] text-[#b8b3c4]">or sign in</span>
            <div className="flex-1 h-px bg-[#e8e4dd]"></div>
          </div>

          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="font-mono text-[9px] text-[#8a8499] tracking-[.1em] uppercase block mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="operator@example.com"
                className="w-full px-3 py-2.5 rounded-[9px] border border-[#e8e4dd] bg-white text-[13px] font-body text-[#1a1624]
                placeholder-[#b8b3c4] focus:outline-none focus:border-[#5b3fd4] transition-colors" />
            </div>
            <div>
              <label className="font-mono text-[9px] text-[#8a8499] tracking-[.1em] uppercase block mb-1.5">Password</label>
              <input type="password" value={pass} onChange={e => setPass(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 rounded-[9px] border border-[#e8e4dd] bg-white text-[13px] font-body text-[#1a1624]
                placeholder-[#b8b3c4] focus:outline-none focus:border-[#5b3fd4] transition-colors" />
            </div>
            <Button type="submit" variant="primary" className="w-full justify-center py-2.5 text-[14px] mt-1" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>
          </form>
        </div>

        <p className="text-center font-mono text-[10px] text-[#b8b3c4] mt-4">
          Pryysm v2.0.0 · Powered by Supabase + Next.js
        </p>
      </div>
    </div>
  )
}

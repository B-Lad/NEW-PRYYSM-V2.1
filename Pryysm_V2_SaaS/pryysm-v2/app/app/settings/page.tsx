'use client'
import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { MOCK_SPOOLS, MOCK_MAINTENANCE, MOCK_MACHINES } from '@/lib/mock-data'
import { fmtWeight } from '@/lib/utils'
import { Package, Wrench, User, Bell, Code } from 'lucide-react'

const TABS = ['Spools', 'Maintenance', 'Notifications', 'API'] as const
type Tab = typeof TABS[number]

const TAB_ICONS = { Spools: Package, Maintenance: Wrench, Notifications: Bell, API: Code }

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>('Spools')

  return (
    <div>
      <div className="mb-5">
        <div className="font-mono text-[9px] text-[#b8b3c4] tracking-[.14em] mb-1">DASHBOARD / SETTINGS</div>
        <h1 className="font-display font-extrabold text-[22px] tracking-tight text-[#1a1624]">Settings</h1>
        <p className="text-[12.5px] text-[#8a8499] font-light mt-1">Manage materials, maintenance, notifications, and API access</p>
      </div>

      <div className="flex gap-1 p-1 bg-[#f0ede8] border border-[#e8e4dd] rounded-[10px] w-fit mb-5">
        {TABS.map(t => {
          const Icon = TAB_ICONS[t]
          return (
            <button key={t} onClick={() => setTab(t)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-[8px] text-[12.5px] font-medium transition-all duration-150 ${
                tab === t ? 'bg-white text-[#5b3fd4] font-semibold shadow-[0_1px_4px_rgba(26,22,36,.10)] border border-[#e8e4dd]' : 'text-[#8a8499] hover:text-[#4a4558]'
              }`}>
              <Icon size={13} strokeWidth={tab === t ? 2 : 1.7} />
              {t}
            </button>
          )
        })}
      </div>

      {/* SPOOLS */}
      {tab === 'Spools' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display font-bold text-[15px] text-[#1a1624]">Filament Spools</h2>
            <Button variant="primary" size="sm"><span>+</span> Add Spool</Button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {MOCK_SPOOLS.map(s => {
              const pct = Math.round((s.remaining_g / s.weight_g) * 100)
              const low = s.remaining_g < 100
              return (
                <Card key={s.id} accent={low ? 'amber' : 'none'}>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-display font-bold text-[13px] text-[#1a1624]">{s.material?.name}</div>
                        <div className="font-mono text-[9px] text-[#8a8499] mt-0.5">{s.brand} · {s.color_name}</div>
                      </div>
                      <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-[5px] bg-[#f0ede8] text-[#8a8499] border border-[#e8e4dd]">
                        {s.id.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline mb-1.5">
                      <span className="text-[12px] text-[#4a4558]">{fmtWeight(s.remaining_g)} remaining</span>
                      <span className={`font-mono text-[12px] font-bold ${low ? 'text-[#a85510]' : 'text-[#1a7048]'}`}>{pct}%</span>
                    </div>
                    <div className="h-[6px] rounded-full bg-[#f0ede8] border border-[#e8e4dd] overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${low ? 'bg-[#a85510]' : 'bg-gradient-to-r from-[#5b3fd4] to-[#1a7048]'}`}
                        style={{ width: `${pct}%` }} />
                    </div>
                    {low && (
                      <div className="mt-2 font-mono text-[9px] text-[#a85510] bg-[#fef3e2] px-2 py-1 rounded-[6px] border border-[#a8551033]">
                        ⚠ Low filament — reorder soon
                      </div>
                    )}
                    {s.lot_number && (
                      <div className="mt-2 font-mono text-[9px] text-[#b8b3c4]">Lot: {s.lot_number}</div>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* MAINTENANCE */}
      {tab === 'Maintenance' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display font-bold text-[15px] text-[#1a1624]">Maintenance Log</h2>
            <Button variant="primary" size="sm"><span>+</span> Log Issue</Button>
          </div>
          <div className="flex flex-col gap-3">
            {MOCK_MAINTENANCE.map(mn => (
              <Card key={mn.id} accent={mn.status === 'open' ? 'red' : 'none'}>
                <div className="p-4 flex items-start gap-4">
                  <div className={`w-9 h-9 rounded-[9px] flex items-center justify-center flex-shrink-0 ${
                    mn.status === 'open' ? 'bg-[#fdecea] border border-[#b8322833]' : 'bg-[#e6f7ef] border border-[#1a704833]'
                  }`}>
                    <Wrench size={15} color={mn.status === 'open' ? '#b83228' : '#1a7048'} strokeWidth={1.8} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-display font-bold text-[13px] text-[#1a1624]">{mn.title}</span>
                      <span className={`font-mono text-[9px] px-2 py-0.5 rounded-full border font-semibold ${
                        mn.status === 'open' ? 'bg-[#fdecea] text-[#b83228] border-[#b8322833]' : 'bg-[#e6f7ef] text-[#1a7048] border-[#1a704833]'
                      }`}>{mn.status.toUpperCase()}</span>
                    </div>
                    {mn.description && <p className="text-[12px] text-[#4a4558] mb-1">{mn.description}</p>}
                    <div className="font-mono text-[9px] text-[#8a8499]">
                      {mn.machine?.name} · {mn.status === 'resolved' ? `Resolved ${mn.resolved_at?.slice(0,10)}` : `Opened ${mn.created_at.slice(0,10)}`}
                    </div>
                  </div>
                  {mn.status === 'open' && (
                    <Button variant="soft" size="sm">Mark Resolved</Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* NOTIFICATIONS */}
      {tab === 'Notifications' && (
        <Card>
          <div className="p-5">
            <h3 className="font-display font-bold text-[14px] text-[#1a1624] mb-4">Notification Channels</h3>
            <div className="space-y-3">
              {[
                { l: 'Email alerts',     sub: 'Receive critical alerts by email', enabled: true },
                { l: 'Push notifications', sub: 'Browser notifications when job completes', enabled: true },
                { l: 'Slack webhook',    sub: 'Post to #3d-printing channel', enabled: false },
                { l: 'Discord webhook',  sub: 'Post to server channel', enabled: false },
              ].map(({ l, sub, enabled: en }) => (
                <div key={l} className="flex items-center justify-between py-3 border-b border-[#f0ede8] last:border-0">
                  <div>
                    <div className="font-medium text-[13px] text-[#1a1624]">{l}</div>
                    <div className="text-[11.5px] text-[#8a8499] mt-0.5">{sub}</div>
                  </div>
                  <button className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${en ? 'bg-[#5b3fd4]' : 'bg-[#d8d3ca]'}`}>
                    <span className={`absolute top-[2px] w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${en ? 'left-[22px]' : 'left-[2px]'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* API */}
      {tab === 'API' && (
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <div className="p-5">
              <h3 className="font-display font-bold text-[14px] text-[#1a1624] mb-4">API Keys</h3>
              <div className="mb-3 p-3 rounded-[9px] bg-[#f0ede8] border border-[#e8e4dd]">
                <div className="font-mono text-[10px] text-[#8a8499] mb-1">Production Key</div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[12px] text-[#1a1624] flex-1">pryysm_live_••••••••••••••••</span>
                  <Button variant="ghost" size="sm">Reveal</Button>
                </div>
              </div>
              <Button variant="primary" size="sm">Generate New Key</Button>
            </div>
          </Card>
          <Card>
            <div className="p-5">
              <h3 className="font-display font-bold text-[14px] text-[#1a1624] mb-4">Webhook Events</h3>
              <div className="space-y-1.5">
                {['job.completed','job.failed','job.paused','filament.runout','maintenance.due','quota.exceeded','ai.failure_detected'].map(e => (
                  <div key={e} className="flex items-center gap-2 px-2.5 py-1.5 rounded-[7px] bg-[#f0ede8] border border-[#e8e4dd]">
                    <span className="w-[5px] h-[5px] rounded-full bg-[#1a7048] flex-shrink-0" />
                    <span className="font-mono text-[10.5px] text-[#4a4558]">{e}</span>
                  </div>
                ))}
              </div>
              <Button variant="soft" size="sm" className="mt-3">Configure Endpoint</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

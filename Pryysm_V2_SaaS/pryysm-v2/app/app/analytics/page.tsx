'use client'
import Card from '@/components/ui/Card'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const REVENUE_DATA = [
  { day: 'Mon', revenue: 8.4,  jobs: 3 },
  { day: 'Tue', revenue: 11.2, jobs: 4 },
  { day: 'Wed', revenue: 6.8,  jobs: 2 },
  { day: 'Thu', revenue: 14.5, jobs: 5 },
  { day: 'Fri', revenue: 9.3,  jobs: 3 },
  { day: 'Sat', revenue: 16.1, jobs: 6 },
  { day: 'Sun', revenue: 13.0, jobs: 4 },
]

const MATERIAL_DATA = [
  { mat: 'PLA+',  g: 420 },
  { mat: 'PETG',  g: 280 },
  { mat: 'ABS',   g: 95  },
  { mat: 'Resin', g: 180 },
  { mat: 'TPU',   g: 60  },
]

const UTILISATION = [
  { printer: 'Ender 5 Pro',     pct: 78 },
  { printer: 'Bambu X1 Carbon', pct: 51 },
  { printer: 'Elegoo Saturn 3', pct: 34 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-[#e8e4dd] rounded-[10px] px-3 py-2 shadow-lg text-[12px]">
      <div className="font-semibold text-[#1a1624] mb-1">{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex gap-2">
          <span style={{ color: p.color }}>{p.name}</span>
          <span className="font-mono font-bold text-[#1a1624]">{p.dataKey === 'revenue' ? `$${p.value.toFixed(2)}` : p.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function AnalyticsPage() {
  const totalRevenue = REVENUE_DATA.reduce((s, d) => s + d.revenue, 0)
  const totalJobs    = REVENUE_DATA.reduce((s, d) => s + d.jobs, 0)

  return (
    <div>
      <div className="mb-5">
        <div className="font-mono text-[9px] text-[#b8b3c4] tracking-[.14em] mb-1">DASHBOARD / ANALYTICS</div>
        <h1 className="font-display font-extrabold text-[22px] tracking-tight text-[#1a1624]">Analytics</h1>
        <p className="text-[12.5px] text-[#8a8499] font-light mt-1">Fleet performance, revenue, and material usage — last 7 days</p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { l: 'Total Revenue',    v: `$${totalRevenue.toFixed(2)}`, c: '#966010' },
          { l: 'Jobs Completed',   v: String(totalJobs),            c: '#5b3fd4' },
          { l: 'Avg per Job',      v: `$${(totalRevenue/totalJobs).toFixed(2)}`, c: '#1a5898' },
          { l: 'Fleet Utilisation',v: '54%',                         c: '#1a7048' },
        ].map(({ l, v, c }) => (
          <Card key={l}>
            <div className="p-4">
              <div className="font-mono text-[8.5px] text-[#8a8499] tracking-[.11em] uppercase mb-2">{l}</div>
              <div className="font-display font-extrabold text-[24px] leading-none" style={{ color: c }}>{v}</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-4">

        {/* Revenue chart */}
        <div className="col-span-8">
          <Card>
            <div className="p-5">
              <h3 className="font-display font-bold text-[14px] text-[#1a1624] mb-4">Revenue This Week</h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={REVENUE_DATA} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#5b3fd4" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#5b3fd4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontFamily: "'Geist Mono'", fontSize: 10, fill: '#b8b3c4' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontFamily: "'Geist Mono'", fontSize: 10, fill: '#b8b3c4' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#5b3fd4" strokeWidth={2} fill="url(#revGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Jobs per day */}
        <div className="col-span-4">
          <Card>
            <div className="p-5">
              <h3 className="font-display font-bold text-[14px] text-[#1a1624] mb-4">Jobs / Day</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={REVENUE_DATA} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontFamily: "'Geist Mono'", fontSize: 10, fill: '#b8b3c4' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontFamily: "'Geist Mono'", fontSize: 10, fill: '#b8b3c4' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="jobs" name="Jobs" fill="#1a7048" radius={[4, 4, 0, 0]} opacity={0.85} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Material usage */}
        <div className="col-span-5">
          <Card>
            <div className="p-5">
              <h3 className="font-display font-bold text-[14px] text-[#1a1624] mb-4">Material Usage (g)</h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={MATERIAL_DATA} layout="vertical" margin={{ top: 0, right: 12, bottom: 0, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" horizontal={false} />
                  <XAxis type="number" tick={{ fontFamily: "'Geist Mono'", fontSize: 10, fill: '#b8b3c4' }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="mat" type="category" tick={{ fontFamily: "'Geist Mono'", fontSize: 10, fill: '#4a4558' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="g" name="Used (g)" fill="#966010" radius={[0, 4, 4, 0]} opacity={0.8} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Printer utilisation */}
        <div className="col-span-7">
          <Card>
            <div className="p-5">
              <h3 className="font-display font-bold text-[14px] text-[#1a1624] mb-4">Printer Utilisation</h3>
              <div className="space-y-4">
                {UTILISATION.map(({ printer, pct }) => (
                  <div key={printer}>
                    <div className="flex justify-between text-[12px] mb-1.5">
                      <span className="font-medium text-[#4a4558]">{printer}</span>
                      <span className="font-mono font-bold text-[#1a1624]">{pct}%</span>
                    </div>
                    <div className="h-[8px] rounded-full bg-[#f0ede8] border border-[#e8e4dd] overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-[#5b3fd4] to-[#1a7048] transition-all duration-700"
                        style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  )
}

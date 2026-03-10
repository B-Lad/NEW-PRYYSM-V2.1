'use client'
import Card from '@/components/ui/Card'
import Sparkline from '@/components/ui/Sparkline'
import { cn } from '@/lib/utils'

interface Props {
  label:      string
  value:      string
  sub?:       string
  color:      string       // CSS var or hex
  sparkData?: number[]
  delay?:     number
}

const STRIPE_COLORS: Record<string, string> = {
  '#5b3fd4': 'from-[#5b3fd4] to-[#8b6ef5]',
  '#1a5898': 'from-[#1a5898] to-[#60a5fa]',
  '#966010': 'from-[#966010] to-[#d97706]',
  '#b83228': 'from-[#b83228] to-[#f87171]',
  '#1a7048': 'from-[#1a7048] to-[#4ade80]',
}

export default function StatCard({ label, value, sub, color, sparkData, delay = 0 }: Props) {
  const grad = STRIPE_COLORS[color] ?? 'from-[#5b3fd4] to-[#8b6ef5]'
  const delayClass = [``, 'delay-1','delay-2','delay-3','delay-4','delay-5'][delay] ?? ''

  return (
    <Card className={cn('animate-float-in', delayClass)}>
      {/* Top stripe */}
      <div className={cn('h-[3px] bg-gradient-to-r rounded-t-[14px]', grad)} />
      <div className="px-[18px] py-4">
        <div className="font-mono text-[8.5px] text-[#8a8499] tracking-[.11em] uppercase mb-2">{label}</div>
        <div className="flex items-end justify-between">
          <div>
            <div className="font-display font-extrabold text-[24px] leading-none animate-ticker" style={{ color }}>{value}</div>
            {sub && <div className="text-[10px] text-[#8a8499] mt-1">{sub}</div>}
          </div>
          {sparkData && <Sparkline data={sparkData} color={color} width={72} height={28} />}
        </div>
      </div>
    </Card>
  )
}

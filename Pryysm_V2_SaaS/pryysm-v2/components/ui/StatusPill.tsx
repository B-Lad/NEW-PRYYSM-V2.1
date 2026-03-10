import { cn } from '@/lib/utils'
import type { PrinterStatus, JobStatus } from '@/lib/types'

type AnyStatus = PrinterStatus | JobStatus | string

const STYLES: Record<string, string> = {
  printing:           'bg-[#e6f7ef] text-[#1a7048] border border-[#1a704833]',
  idle:               'bg-[#e8f2fc] text-[#1a5898] border border-[#1a589833]',
  error:              'bg-[#fdecea] text-[#b83228] border border-[#b8322833]',
  paused:             'bg-[#fef3e2] text-[#a85510] border border-[#a8551033]',
  queued:             'bg-[#ede9fd] text-[#5b3fd4] border border-[#5b3fd433]',
  pending:            'bg-[#f0ede8] text-[#8a8499] border border-[#8a849933]',
  offline:            'bg-[#f0ede8] text-[#8a8499] border border-[#8a849933]',
  awaiting_clearance: 'bg-[#fef3e2] text-[#a85510] border border-[#a8551033]',
  completed:          'bg-[#f0ede8] text-[#8a8499] border border-[#8a849933]',
  cancelled:          'bg-[#f0ede8] text-[#8a8499] border border-[#8a849933]',
}

const DOT_ANIMATE: Record<string, string> = {
  printing: 'animate-breathe',
  queued:   'animate-breathe',
}

const DOT_COLOR: Record<string, string> = {
  printing:           'bg-[#1a7048]',
  idle:               'bg-[#1a5898]',
  error:              'bg-[#b83228]',
  paused:             'bg-[#a85510]',
  queued:             'bg-[#5b3fd4]',
  pending:            'bg-[#8a8499]',
  offline:            'bg-[#8a8499]',
  awaiting_clearance: 'bg-[#a85510]',
  completed:          'bg-[#b8b3c4]',
  cancelled:          'bg-[#b8b3c4]',
}

const LABELS: Record<string, string> = {
  printing: 'PRINTING', idle: 'IDLE', error: 'ERROR', paused: 'PAUSED',
  queued: 'QUEUED', pending: 'PENDING', offline: 'OFFLINE',
  awaiting_clearance: 'AWAITING', completed: 'DONE', cancelled: 'CANCELLED',
}

interface Props { status: AnyStatus; className?: string }

export default function StatusPill({ status, className }: Props) {
  const s = status.toLowerCase()
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full',
      'font-mono text-[9.5px] font-semibold tracking-wider',
      STYLES[s] ?? STYLES.pending,
      className,
    )}>
      <span className={cn('w-[5px] h-[5px] rounded-full flex-shrink-0', DOT_COLOR[s] ?? 'bg-[#8a8499]', DOT_ANIMATE[s])} />
      {LABELS[s] ?? s.toUpperCase()}
    </span>
  )
}

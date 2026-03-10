import { cn } from '@/lib/utils'

interface Props {
  children: React.ReactNode
  className?: string
  accent?: 'green' | 'blue' | 'red' | 'amber' | 'violet' | 'cream' | 'none'
  onClick?: () => void
}

const ACCENT_COLOR = {
  green:  'border-t-[#1a7048]',
  blue:   'border-t-[#1a5898]',
  red:    'border-t-[#b83228]',
  amber:  'border-t-[#a85510]',
  violet: 'border-t-[#5b3fd4]',
  cream:  'border-t-[#966010]',
  none:   '',
}

export default function Card({ children, className, accent = 'none', onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white border border-[#e8e4dd] rounded-[14px] overflow-hidden',
        'shadow-[0_1px_3px_rgba(26,22,36,.06),0_4px_14px_rgba(26,22,36,.07)]',
        'transition-all duration-200',
        'hover:shadow-[0_4px_14px_rgba(26,22,36,.09),0_16px_44px_rgba(26,22,36,.11)] hover:border-[#d8d3ca]',
        accent !== 'none' && 'border-t-[3px]',
        accent !== 'none' && ACCENT_COLOR[accent],
        onClick && 'cursor-pointer',
        className,
      )}
    >
      {children}
    </div>
  )
}

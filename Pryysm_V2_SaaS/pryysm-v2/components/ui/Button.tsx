import { cn } from '@/lib/utils'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger' | 'soft'
  size?: 'sm' | 'md'
  children: React.ReactNode
}

const VARIANTS = {
  primary: 'bg-gradient-to-br from-[#5b3fd4] to-[#7c5af5] text-white border border-[#5b3fd433] shadow-[0_2px_8px_rgba(91,63,212,.28)] hover:shadow-[0_4px_16px_rgba(91,63,212,.38)] hover:-translate-y-px',
  ghost:   'bg-white text-[#4a4558] border border-[#d8d3ca] shadow-[0_1px_3px_rgba(26,22,36,.06)] hover:bg-[#f0ede8]',
  danger:  'bg-[#fdecea] text-[#b83228] border border-[#b8322833] hover:bg-[#f9d9d7]',
  soft:    'bg-[#ede9fd] text-[#5b3fd4] border border-[#5b3fd433] hover:bg-[#e0d9f9]',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-xs rounded-[8px]',
  md: 'px-4 py-[7px] text-[12.5px] rounded-[9px]',
}

export default function Button({ variant = 'ghost', size = 'md', className, children, ...props }: Props) {
  return (
    <button
      className={cn(
        'inline-flex items-center gap-1.5 font-body font-[500] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

'use client'

interface Props {
  value:    number
  max:      number
  color:    string
  label:    string
  size?:    number
}

export default function ArcGauge({ value, max, color, label, size = 56 }: Props) {
  const cx = size / 2
  const cy = size / 2
  const r  = size * 0.357   // ~20 for size=56
  const strokeW = size * 0.063
  const C = 2 * Math.PI * r
  const arc = C * 0.75
  const pct = Math.min(value / max, 1)
  const rot = 135

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Track */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke="#e8e4dd"
        strokeWidth={strokeW}
        strokeDasharray={`${arc} ${C}`}
        strokeDashoffset={0}
        strokeLinecap="round"
        transform={`rotate(${rot} ${cx} ${cy})`}
      />
      {/* Fill */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke={color}
        strokeWidth={strokeW}
        strokeDasharray={`${pct * arc} ${C}`}
        strokeDashoffset={0}
        strokeLinecap="round"
        transform={`rotate(${rot} ${cx} ${cy})`}
        style={{ transition: 'stroke-dasharray 1.3s cubic-bezier(.4,0,.2,1)' }}
      />
      {/* Label */}
      <text
        x={cx} y={cy + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={color}
        fontSize={size * 0.17}
        fontWeight={700}
        fontFamily="'Geist Mono', monospace"
      >
        {label}
      </text>
    </svg>
  )
}

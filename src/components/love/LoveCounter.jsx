import { useMemo } from 'react'

const START_DATE = new Date('2024-04-04T00:00:00')

function getDaysTogether() {
  const now = new Date()
  const diff = now - START_DATE
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export default function LoveCounter() {
  const days = useMemo(() => getDaysTogether(), [])
  const digits = String(days).split('')

  const milestone = days >= 365
    ? `${Math.floor(days / 365)}y ${days % 365}d`
    : days >= 100
    ? `${Math.floor(days / 100) * 100}+ days`
    : `day ${days}`

  return (
    <div className="flex flex-col items-center pt-8 pb-5 px-4">
      {/* Eyebrow label */}
      <p className="text-rose-300 text-xs tracking-[0.25em] uppercase font-medium mb-4">
        together since 2024.04.04
      </p>

      {/* Big number */}
      <div className="flex items-end justify-center gap-0.5">
        {digits.map((d, i) => (
          <span
            key={i}
            className="shimmer-text font-bold"
            style={{ fontSize: '4.5rem', lineHeight: 1, letterSpacing: '-0.02em' }}
          >
            {d}
          </span>
        ))}
        <span className="text-rose-300 font-light text-2xl mb-2 ml-2 tracking-wide">
          days
        </span>
      </div>

      {/* Thin divider line */}
      <div className="w-12 h-px bg-rose-200 my-4" />

      {/* Milestone pill */}
      <div className="inline-flex items-center gap-1.5 border border-rose-200 text-rose-400 text-xs font-medium px-4 py-1.5 rounded-full tracking-wide">
        <span className="animate-pulse-heart">♡</span>
        <span>{milestone}</span>
      </div>
    </div>
  )
}

import { useMemo } from 'react'
import DogIllustration from '../DogIllustration'

const START_DATE = new Date('2024-04-04T00:00:00')

function getDaysTogether() {
  const now = new Date()
  const diff = now - START_DATE
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

function formatStartDate() {
  return '2024.04.04'
}

export default function LoveCounter() {
  const days = useMemo(() => getDaysTogether(), [])

  // Split days into individual digits for animation
  const digits = String(days).split('')

  return (
    <div className="flex flex-col items-center py-5 px-4">
      {/* Dog illustration */}
      <div className="relative">
        <DogIllustration size={130} className="animate-float drop-shadow-sm" />
        {/* Floating hearts */}
        <span
          className="absolute top-0 right-0 text-lg animate-pulse-heart"
          style={{ animationDelay: '0s' }}
        >
          💕
        </span>
        <span
          className="absolute top-6 left-0 text-sm animate-pulse-heart"
          style={{ animationDelay: '0.5s' }}
        >
          🌸
        </span>
      </div>

      {/* Days counter */}
      <div className="mt-2 text-center">
        <p className="text-gray-400 text-xs tracking-widest uppercase mb-1">Together</p>
        <div className="flex items-end justify-center gap-1">
          {digits.map((d, i) => (
            <span
              key={i}
              className="shimmer-text font-bold"
              style={{
                fontSize: '3.5rem',
                lineHeight: 1,
                animationDelay: `${i * 0.15}s`,
              }}
            >
              {d}
            </span>
          ))}
          <span className="text-rose-300 font-semibold text-xl mb-1 ml-1">天</span>
        </div>

        {/* Sub-info */}
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="text-rose-200 text-xs">❤️</span>
          <span className="text-gray-400 text-xs">
            {formatStartDate()} — 今天
          </span>
          <span className="text-rose-200 text-xs">❤️</span>
        </div>

        {/* Milestone badge */}
        {days > 0 && (
          <div className="mt-3 inline-flex items-center gap-1.5 bg-rose-100 text-rose-400 text-xs font-medium px-3 py-1 rounded-full">
            <span>🎉</span>
            <span>
              {days >= 365
                ? `${Math.floor(days / 365)} 周年 ${days % 365} 天`
                : days >= 100
                ? `已突破 ${Math.floor(days / 100) * 100} 天`
                : `第 ${days} 天`}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
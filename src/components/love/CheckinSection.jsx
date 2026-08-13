import { useState } from 'react'

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

// ── Add Checkin Modal ──────────────────────────────────────────────────────────
function AddCheckinModal({ onAdd, onClose }) {
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('✅')

  const EMOJI_OPTIONS = ['✅', '🔥', '💊', '📚', '🏃', '💧', '🎵', '🌙', '☀️', '💪']

  function handleAdd() {
    if (!name.trim()) return
    onAdd({ id: uid(), name: name.trim(), emoji, completedDates: [] })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end" onClick={onClose}>
      <div
        className="w-full bg-white bottom-sheet p-6 pb-safe animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
        <h3 className="text-gray-700 font-semibold mb-4">添加打卡项</h3>

        {/* Emoji picker */}
        <div className="flex gap-2 flex-wrap mb-4">
          {EMOJI_OPTIONS.map((e) => (
            <button
              key={e}
              onClick={() => setEmoji(e)}
              className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                emoji === e ? 'bg-rose-100 scale-110' : 'bg-gray-50'
              }`}
            >
              {e}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="打卡项名称，如：dy续火花"
          className="w-full bg-rose-50 border border-rose-100 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300 mb-4"
          autoFocus
          maxLength={20}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-gray-100 text-gray-400 text-sm"
          >
            取消
          </button>
          <button
            onClick={handleAdd}
            disabled={!name.trim()}
            className="flex-1 py-3 rounded-xl bg-rose-400 text-white text-sm font-medium disabled:opacity-50"
          >
            添加
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function CheckinSection({ checkins = [], onChange }) {
  const [showAdd, setShowAdd] = useState(false)
  const today = todayStr()

  function toggleCheckin(id) {
    const updated = checkins.map((item) => {
      if (item.id !== id) return item
      const dates = item.completedDates || []
      const alreadyDone = dates.includes(today)
      return {
        ...item,
        completedDates: alreadyDone
          ? dates.filter((d) => d !== today)
          : [...dates, today],
      }
    })
    onChange(updated)
  }

  function deleteItem(id) {
    onChange(checkins.filter((item) => item.id !== id))
  }

  function addItem(item) {
    onChange([...checkins, item])
  }

  // Streak calculation
  function getStreak(item) {
    const dates = [...(item.completedDates || [])].sort()
    if (!dates.length) return 0
    let streak = 0
    let cursor = new Date(today)
    while (true) {
      const d = cursor.toISOString().slice(0, 10)
      if (dates.includes(d)) {
        streak++
        cursor.setDate(cursor.getDate() - 1)
      } else {
        break
      }
    }
    return streak
  }

  const doneCount = checkins.filter((c) => (c.completedDates || []).includes(today)).length

  return (
    <div className="px-4 mb-4">
      {/* Section header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-gray-700">每日打卡</span>
          {checkins.length > 0 && (
            <span className="text-xs text-rose-400 bg-rose-50 px-2 py-0.5 rounded-full">
              {doneCount}/{checkins.length}
            </span>
          )}
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="w-7 h-7 rounded-full bg-rose-400 text-white flex items-center justify-center text-lg leading-none active:scale-90 transition-transform"
        >
          +
        </button>
      </div>

      {/* Items */}
      {checkins.length === 0 ? (
        <div
          className="card p-4 flex flex-col items-center gap-2 border-2 border-dashed border-rose-100"
          onClick={() => setShowAdd(true)}
        >
          <span className="text-2xl">📋</span>
          <p className="text-gray-300 text-sm">点击 + 添加每日打卡项</p>
        </div>
      ) : (
        <div className="space-y-2">
          {checkins.map((item) => {
            const done = (item.completedDates || []).includes(today)
            const streak = getStreak(item)
            return (
              <div
                key={item.id}
                className={`card flex items-center gap-3 px-4 py-3 transition-all active:scale-98 ${
                  done ? 'bg-rose-50' : ''
                }`}
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggleCheckin(item.id)}
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all active:scale-90 ${
                    done
                      ? 'bg-rose-400 border-rose-400 animate-check-pop'
                      : 'border-rose-200'
                  }`}
                >
                  {done && (
                    <svg viewBox="0 0 12 10" fill="none" className="w-3.5 h-3">
                      <path d="M1 5l3.5 3.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>

                {/* Emoji + name */}
                <span className="text-xl">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${done ? 'text-rose-400 line-through' : 'text-gray-700'}`}>
                    {item.name}
                  </p>
                  {streak > 1 && (
                    <p className="text-xs text-orange-400">🔥 连续 {streak} 天</p>
                  )}
                </div>

                {/* Delete */}
                <button
                  onClick={() => deleteItem(item.id)}
                  className="text-gray-200 active:text-red-300 transition-colors p-1"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )
          })}
        </div>
      )}

      {showAdd && (
        <AddCheckinModal onAdd={addItem} onClose={() => setShowAdd(false)} />
      )}
    </div>
  )
}
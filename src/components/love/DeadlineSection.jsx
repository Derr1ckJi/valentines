import { useState } from 'react'

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

function daysUntil(dateStr) {
  const target = new Date(dateStr + 'T00:00:00')
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24))
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

// ── Add Deadline Modal ─────────────────────────────────────────────────────────
function AddDeadlineModal({ onAdd, onClose }) {
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('🎯')
  const [targetDate, setTargetDate] = useState('')
  const [note, setNote] = useState('')

  const EMOJI_OPTIONS = ['🎯', '💪', '✈️', '🎂', '📅', '🏆', '💰', '🌟', '🎓', '❤️']

  // Default date = 30 days from now
  const minDate = new Date().toISOString().slice(0, 10)

  function handleAdd() {
    if (!name.trim() || !targetDate) return
    onAdd({
      id: uid(),
      name: name.trim(),
      emoji,
      targetDate,
      note: note.trim(),
      createdAt: new Date().toISOString().slice(0, 10),
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end" onClick={onClose}>
      <div
        className="w-full bg-white bottom-sheet animate-fade-up flex flex-col"
        style={{ maxHeight: '85vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Scrollable content */}
        <div className="overflow-y-auto px-6 pt-5 pb-3">
          <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
          <h3 className="text-gray-700 font-semibold mb-4">添加小目标</h3>

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

          <div className="space-y-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="目标名称，如：瘦到100斤"
              className="w-full bg-rose-50 border border-rose-100 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300"
              autoFocus
              maxLength={30}
            />

            <div>
              <label className="text-xs text-gray-400 block mb-1 ml-1">截止日期</label>
              <input
                type="date"
                value={targetDate}
                min={minDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full bg-rose-50 border border-rose-100 rounded-xl px-4 py-3 text-sm text-gray-700"
              />
            </div>

            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="备注（可选），如：目标体重 100 斤"
              className="w-full bg-rose-50 border border-rose-100 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300"
              maxLength={40}
            />
          </div>
        </div>

        {/* Sticky buttons — always visible above keyboard */}
        <div className="px-6 pt-3 pb-safe pb-5 bg-white border-t border-gray-50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-gray-100 text-gray-400 text-sm"
          >
            取消
          </button>
          <button
            onClick={handleAdd}
            disabled={!name.trim() || !targetDate}
            className="flex-1 py-3 rounded-xl bg-rose-400 text-white text-sm font-medium disabled:opacity-50"
          >
            添加
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Deadline Card ──────────────────────────────────────────────────────────────
function DeadlineCard({ item, onDelete }) {
  const remaining = daysUntil(item.targetDate)
  const isOverdue = remaining < 0
  const isUrgent = remaining >= 0 && remaining <= 7
  const isDone = remaining === 0

  let statusColor = 'text-gray-500'
  let bgColor = ''
  let statusText = `还有 ${remaining} 天`

  if (isDone) {
    statusColor = 'text-green-500'
    bgColor = 'bg-green-50'
    statusText = '🎉 今天截止！'
  } else if (isOverdue) {
    statusColor = 'text-red-400'
    bgColor = 'bg-red-50'
    statusText = `已过期 ${Math.abs(remaining)} 天`
  } else if (isUrgent) {
    statusColor = 'text-orange-400'
    statusText = `⚡ 还有 ${remaining} 天`
  }

  return (
    <div className={`card px-4 py-3 ${bgColor}`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl mt-0.5">{item.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-700 truncate">{item.name}</p>
          {item.note && (
            <p className="text-xs text-gray-400 mt-0.5 truncate">{item.note}</p>
          )}
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs text-gray-300">📅 {formatDate(item.targetDate)}</span>
            <span className={`text-xs font-medium ${statusColor}`}>{statusText}</span>
          </div>
        </div>
        <button
          onClick={() => onDelete(item.id)}
          className="text-gray-200 active:text-red-300 transition-colors p-1 flex-shrink-0"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Progress bar: days elapsed / total days */}
      {!isOverdue && item.createdAt && (
        <ProgressBar createdAt={item.createdAt} targetDate={item.targetDate} />
      )}
    </div>
  )
}

function ProgressBar({ createdAt, targetDate }) {
  const start = new Date(createdAt + 'T00:00:00')
  const end = new Date(targetDate + 'T00:00:00')
  const now = new Date()
  now.setHours(0, 0, 0, 0)

  const total = end - start
  const elapsed = now - start
  const pct = total <= 0 ? 100 : Math.min(100, Math.max(0, (elapsed / total) * 100))

  return (
    <div className="mt-2.5 h-1.5 bg-rose-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-rose-300 rounded-full transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function DeadlineSection({ deadlines = [], onChange }) {
  const [showAdd, setShowAdd] = useState(false)

  function addItem(item) {
    onChange([...deadlines, item])
  }

  function deleteItem(id) {
    onChange(deadlines.filter((d) => d.id !== id))
  }

  return (
    <div className="px-4 mb-6">
      {/* Section header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-base font-semibold text-gray-700">小目标</span>
        <button
          onClick={() => setShowAdd(true)}
          className="w-7 h-7 rounded-full bg-rose-400 text-white flex items-center justify-center text-lg leading-none active:scale-90 transition-transform"
        >
          +
        </button>
      </div>

      {/* Items */}
      {deadlines.length === 0 ? (
        <div
          className="card p-4 flex flex-col items-center gap-2 border-2 border-dashed border-rose-100"
          onClick={() => setShowAdd(true)}
        >
          <span className="text-2xl">🎯</span>
          <p className="text-gray-300 text-sm">点击 + 添加小目标</p>
        </div>
      ) : (
        <div className="space-y-2">
          {deadlines.map((item) => (
            <DeadlineCard key={item.id} item={item} onDelete={deleteItem} />
          ))}
        </div>
      )}

      {showAdd && (
        <AddDeadlineModal onAdd={addItem} onClose={() => setShowAdd(false)} />
      )}
    </div>
  )
}
import { useState } from 'react'
import TravelCard from './TravelCard'
import AddTravelModal from './AddTravelModal'

export default function TravelPage({ data, onUpdate }) {
  const [showAdd, setShowAdd] = useState(false)

  const travels = [...(data.travels || [])].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  )

  function handleAdd(entry) {
    onUpdate({ ...data, travels: [entry, ...(data.travels || [])] })
  }

  function handleDelete(id) {
    onUpdate({ ...data, travels: (data.travels || []).filter((t) => t.id !== id) })
  }

  return (
    <div className="relative h-full">
      <div className="scroll-area h-full px-4 pt-2 pb-24">
        {travels.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center h-full gap-4 pb-16">
            <div className="text-6xl animate-float">🗺️</div>
            <p className="text-gray-400 text-sm text-center leading-relaxed">
              还没有旅行记录<br />
              点击右下角 <span className="text-rose-400 font-medium">+</span> 开始记录你们的足迹吧
            </p>
          </div>
        ) : (
          <>
            {/* Stats bar */}
            <div className="flex items-center gap-3 mb-4">
              <div className="card flex-1 px-4 py-2.5 flex items-center gap-2">
                <span className="text-lg">🗺️</span>
                <div>
                  <p className="text-xs text-gray-400">足迹数</p>
                  <p className="text-base font-bold text-rose-400">{travels.length}</p>
                </div>
              </div>
              <div className="card flex-1 px-4 py-2.5 flex items-center gap-2">
                <span className="text-lg">📍</span>
                <div>
                  <p className="text-xs text-gray-400">去过的地方</p>
                  <p className="text-base font-bold text-rose-400">
                    {new Set(travels.map((t) => t.location)).size}
                  </p>
                </div>
              </div>
            </div>

            {/* Feed */}
            <div className="space-y-4">
              {travels.map((travel) => (
                <div key={travel.id} className="relative">
                  <TravelCard travel={travel} onDelete={handleDelete} />
                </div>
              ))}
            </div>

            <div className="h-4" />
          </>
        )}
      </div>

      {/* FAB – Add button */}
      <button
        onClick={() => setShowAdd(true)}
        className="fixed bottom-24 right-5 w-14 h-14 bg-rose-400 text-white rounded-full shadow-lg flex items-center justify-center text-2xl active:scale-90 transition-transform z-40"
        style={{ boxShadow: '0 4px 20px rgba(251,113,133,0.45)' }}
      >
        +
      </button>

      {showAdd && (
        <AddTravelModal onAdd={handleAdd} onClose={() => setShowAdd(false)} />
      )}
    </div>
  )
}
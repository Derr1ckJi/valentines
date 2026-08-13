export default function TabBar({ activeTab, onTabChange }) {
  const tabs = [
    {
      id: 'love',
      label: '我们',
      icon: (active) => (
        <svg viewBox="0 0 24 24" fill={active ? '#fb7185' : 'none'} stroke={active ? '#fb7185' : '#d1d5db'} strokeWidth="2" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      id: 'travel',
      label: '足迹',
      icon: (active) => (
        <svg viewBox="0 0 24 24" fill={active ? '#fb7185' : 'none'} stroke={active ? '#fb7185' : '#d1d5db'} strokeWidth="2" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ]

  return (
    <div
      className="flex bg-white border-t border-rose-100 pb-safe"
      style={{ boxShadow: '0 -2px 12px rgba(251,113,133,0.08)' }}
    >
      {tabs.map((tab) => {
        const active = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex-1 flex flex-col items-center justify-center py-3 gap-0.5 transition-all active:scale-95"
          >
            {tab.icon(active)}
            <span
              className={`text-xs font-medium transition-colors ${
                active ? 'text-rose-400' : 'text-gray-300'
              }`}
            >
              {tab.label}
            </span>
            {active && (
              <span className="w-1 h-1 rounded-full bg-rose-400 animate-bounce-in" />
            )}
          </button>
        )
      })}
    </div>
  )
}
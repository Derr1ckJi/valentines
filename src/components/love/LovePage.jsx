import LoveCounter from './LoveCounter'
import CheckinSection from './CheckinSection'
import DeadlineSection from './DeadlineSection'

export default function LovePage({ data, onUpdate }) {
  function handleCheckinsChange(checkins) {
    onUpdate({ ...data, checkins })
  }

  function handleDeadlinesChange(deadlines) {
    onUpdate({ ...data, deadlines })
  }

  return (
    <div className="scroll-area h-full">
      {/* Love counter hero */}
      <LoveCounter />

      {/* Divider */}
      <div className="mx-4 mb-4 h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent" />

      {/* Daily checkins */}
      <CheckinSection
        checkins={data.checkins || []}
        onChange={handleCheckinsChange}
      />

      {/* Deadlines / goals */}
      <DeadlineSection
        deadlines={data.deadlines || []}
        onChange={handleDeadlinesChange}
      />

      {/* Bottom padding so content clears the tab bar */}
      <div className="h-4" />
    </div>
  )
}
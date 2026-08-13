import { useState, useEffect, useCallback } from 'react'
import TabBar from './components/TabBar'
import LovePage from './components/love/LovePage'
import TravelPage from './components/travel/TravelPage'
import SettingsModal from './components/SettingsModal'
import SetupScreen from './components/SetupScreen'
import DogIllustration from './components/DogIllustration'
import { isConfigured, loadData, saveData } from './services/github'

export default function App() {
  const [activeTab, setActiveTab] = useState('love')
  const [showSettings, setShowSettings] = useState(false)
  const [appData, setAppData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [configured, setConfigured] = useState(isConfigured())
  const [saving, setSaving] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await loadData()
      setAppData(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (configured) fetchData()
    else setLoading(false)
  }, [configured, fetchData])

  async function updateData(newData) {
    setAppData(newData)
    setSaving(true)
    try {
      await saveData(newData)
    } catch (err) {
      console.error('Save failed:', err)
    } finally {
      setSaving(false)
    }
  }

  if (!configured) {
    return <SetupScreen onComplete={() => setConfigured(true)} />
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-rose-50 gap-4">
        <DogIllustration size={100} className="animate-float" />
        <p className="text-rose-300 text-sm animate-pulse">加载中…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-rose-50 px-8 gap-4">
        <span className="text-5xl">😢</span>
        <p className="text-gray-500 text-sm text-center">{error}</p>
        <button
          onClick={fetchData}
          className="bg-rose-400 text-white px-8 py-2.5 rounded-full text-sm font-medium"
        >
          重试
        </button>
        <button
          onClick={() => setShowSettings(true)}
          className="text-rose-300 text-sm"
        >
          检查设置
        </button>
        {showSettings && (
          <SettingsModal
            onClose={() => setShowSettings(false)}
            onSave={() => { setShowSettings(false); fetchData() }}
          />
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-rose-50">
      {/* Status bar spacer + header */}
      <div
        className="flex items-center justify-between px-5 pt-safe"
        style={{ paddingTop: `calc(env(safe-area-inset-top) + 12px)` }}
      >
        <div className="flex items-center gap-2">
          <span className="text-rose-400 font-bold text-lg tracking-tight">
            {activeTab === 'love' ? 'just us 💕' : '🐾 旅行足迹'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {saving && (
            <span className="text-rose-300 text-xs animate-pulse">同步中…</span>
          )}
          <button
            onClick={() => setShowSettings(true)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-400 active:scale-90 transition-transform"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Page content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'love' && appData && (
          <LovePage data={appData} onUpdate={updateData} />
        )}
        {activeTab === 'travel' && appData && (
          <TravelPage data={appData} onUpdate={updateData} />
        )}
      </div>

      {/* Bottom tab bar */}
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Settings modal */}
      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          onSave={() => { setShowSettings(false); fetchData() }}
        />
      )}
    </div>
  )
}
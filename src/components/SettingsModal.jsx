import { useState } from 'react'
import { getConfig, setConfig } from '../services/github'

export default function SettingsModal({ onClose, onSave }) {
  const cfg = getConfig()
  const [token, setToken] = useState(cfg.token)
  const [owner, setOwner] = useState(cfg.owner)
  const [repo, setRepo] = useState(cfg.repo)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave(e) {
    e.preventDefault()
    if (!token.trim() || !owner.trim() || !repo.trim()) {
      setError('请填写所有字段')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`https://api.github.com/repos/${owner.trim()}/${repo.trim()}`, {
        headers: { Authorization: `Bearer ${token.trim()}` },
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || `无法访问仓库 (${res.status})`)
      }
      setConfig({ token: token.trim(), owner: owner.trim(), repo: repo.trim() })
      setSaved(true)
      setTimeout(() => onSave(), 800)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleClearCache() {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith('photo_cache_'))
    keys.forEach((k) => localStorage.removeItem(k))
    alert(`已清除 ${keys.length} 张照片缓存`)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end" onClick={onClose}>
      <div
        className="w-full bg-white bottom-sheet p-6 pb-safe animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />

        <h2 className="text-gray-700 font-semibold text-lg mb-4">⚙️ 设置</h2>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1">GitHub Token</label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxx"
              className="w-full bg-rose-50 border border-rose-100 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-gray-500 font-medium block mb-1">用户名</label>
              <input
                type="text"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                placeholder="username"
                className="w-full bg-rose-50 border border-rose-100 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 font-medium block mb-1">仓库名</label>
              <input
                type="text"
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                placeholder="repo-name"
                className="w-full bg-rose-50 border border-rose-100 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-xs bg-red-50 rounded-xl px-4 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || saved}
            className="w-full bg-rose-400 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60"
          >
            {saved ? '✓ 已保存' : loading ? '验证中…' : '保存'}
          </button>
        </form>

        <button
          onClick={handleClearCache}
          className="w-full mt-3 text-gray-400 text-sm py-2"
        >
          清除照片缓存
        </button>

        <button
          onClick={onClose}
          className="w-full mt-1 text-gray-300 text-sm py-2"
        >
          取消
        </button>
      </div>
    </div>
  )
}
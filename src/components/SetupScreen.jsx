import { useState } from 'react'
import { setConfig } from '../services/github'
import DogIllustration from './DogIllustration'

export default function SetupScreen({ onComplete }) {
  const [token, setToken] = useState('')
  const [owner, setOwner] = useState('')
  const [repo, setRepo] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!token.trim() || !owner.trim() || !repo.trim()) {
      setError('请填写所有字段')
      return
    }
    setLoading(true)
    setError('')

    // Quick validation: try to access the repo
    try {
      const res = await fetch(`https://api.github.com/repos/${owner.trim()}/${repo.trim()}`, {
        headers: { Authorization: `Bearer ${token.trim()}` },
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || `无法访问仓库 (${res.status})`)
      }
      setConfig({ token: token.trim(), owner: owner.trim(), repo: repo.trim() })
      onComplete()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full bg-rose-50 px-6 pt-safe">
      <div className="animate-fade-up w-full max-w-sm">
        {/* Dog + title */}
        <div className="flex flex-col items-center mb-8">
          <DogIllustration size={120} className="animate-float" />
          <h1 className="text-2xl font-bold text-rose-500 mt-3">Valentiles 💕</h1>
          <p className="text-rose-300 text-sm mt-1">我们的专属小窝</p>
        </div>

        {/* Setup card */}
        <div className="card p-6">
          <h2 className="text-gray-700 font-semibold mb-1">首次配置</h2>
          <p className="text-gray-400 text-xs mb-5 leading-relaxed">
            数据将存储在你的 GitHub 私有仓库中。
            请先在 GitHub 创建一个私有仓库，并生成一个具有 <code className="bg-rose-50 px-1 rounded">repo</code> 权限的 Personal Access Token。
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1">
                GitHub Token
              </label>
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

            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1">
                GitHub 用户名
              </label>
              <input
                type="text"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                placeholder="your-username"
                className="w-full bg-rose-50 border border-rose-100 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1">
                仓库名称
              </label>
              <input
                type="text"
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                placeholder="valentiles-data"
                className="w-full bg-rose-50 border border-rose-100 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs bg-red-50 rounded-xl px-4 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rose-400 hover:bg-rose-500 active:bg-rose-600 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60"
            >
              {loading ? '验证中…' : '开始使用 🐾'}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-300 text-xs mt-4">
          Token 仅保存在本设备，不会上传到任何服务器
        </p>
      </div>
    </div>
  )
}
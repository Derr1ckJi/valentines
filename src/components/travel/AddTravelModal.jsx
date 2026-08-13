import { useState, useRef } from 'react'
import { uploadPhoto } from '../../services/github'

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

export default function AddTravelModal({ onAdd, onClose }) {
  const [location, setLocation] = useState('')
  const [caption, setCaption] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  function handlePhotoSelect(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    const url = URL.createObjectURL(file)
    setPhotoPreview(url)
  }

  async function handleSubmit() {
    if (!location.trim()) {
      setError('请填写地点')
      return
    }
    setUploading(true)
    setError('')

    try {
      let photoId = null
      if (photoFile) {
        photoId = uid()
        await uploadPhoto(photoId, photoFile)
      }

      onAdd({
        id: uid(),
        date,
        location: location.trim(),
        caption: caption.trim(),
        photoId,
        createdAt: new Date().toISOString(),
      })
      onClose()
    } catch (err) {
      setError(err.message || '上传失败，请重试')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end" onClick={onClose}>
      <div
        className="w-full bg-white bottom-sheet animate-fade-up"
        style={{ maxHeight: '92vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="sticky top-0 bg-white pt-4 pb-2 px-6 z-10">
          <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-3" />
          <div className="flex items-center justify-between">
            <h3 className="text-gray-700 font-semibold text-lg">记录新足迹 🐾</h3>
            <button onClick={onClose} className="text-gray-300 p-1">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-6 pb-safe space-y-4 pb-6">
          {/* Photo picker */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-2xl overflow-hidden border-2 border-dashed border-rose-200 bg-rose-50 active:bg-rose-100 transition-colors"
              style={{ aspectRatio: '4/3' }}
            >
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-rose-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                  </svg>
                  <span className="text-sm">点击选择照片</span>
                  <span className="text-xs text-rose-200">支持相机拍摄或相册选取</span>
                </div>
              )}
            </button>
            {photoPreview && (
              <button
                onClick={() => { setPhotoFile(null); setPhotoPreview(null) }}
                className="w-full text-center text-xs text-gray-300 mt-1 py-1"
              >
                重新选择
              </button>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="text-xs text-gray-400 font-medium block mb-1 ml-1">
              📍 地点 <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="如：上海外滩、京都岚山"
              className="w-full bg-rose-50 border border-rose-100 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300"
              maxLength={30}
            />
          </div>

          {/* Date */}
          <div>
            <label className="text-xs text-gray-400 font-medium block mb-1 ml-1">
              📅 日期
            </label>
            <input
              type="date"
              value={date}
              max={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-rose-50 border border-rose-100 rounded-xl px-4 py-3 text-sm text-gray-700"
            />
          </div>

          {/* Caption */}
          <div>
            <label className="text-xs text-gray-400 font-medium block mb-1 ml-1">
              💬 备注
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="写点什么吧…"
              rows={3}
              maxLength={100}
              className="w-full bg-rose-50 border border-rose-100 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300 resize-none"
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs bg-red-50 rounded-xl px-4 py-2">{error}</p>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={uploading || !location.trim()}
            className="w-full bg-rose-400 text-white font-semibold py-3.5 rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>上传中…</span>
              </>
            ) : (
              '保存足迹 🐾'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
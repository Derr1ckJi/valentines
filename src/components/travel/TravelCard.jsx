import { useState, useEffect } from 'react'
import { getPhotoDataUrl } from '../../services/github'

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const weekdays = ['日', '一', '二', '三', '四', '五', '六']
  const weekday = weekdays[d.getDay()]
  return { full: `${year}.${month}.${day}`, weekday: `周${weekday}` }
}

export default function TravelCard({ travel, onDelete }) {
  const [photoUrl, setPhotoUrl] = useState(null)
  const [imgLoading, setImgLoading] = useState(true)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)

  useEffect(() => {
    if (travel.photoId) {
      getPhotoDataUrl(travel.photoId).then((url) => {
        setPhotoUrl(url)
        setImgLoading(false)
      })
    } else {
      setImgLoading(false)
    }
  }, [travel.photoId])

  const { full, weekday } = formatDate(travel.date)

  return (
    <div className="card overflow-hidden animate-fade-up">
      {/* Photo */}
      {travel.photoId && (
        <div className="relative w-full bg-rose-50" style={{ aspectRatio: '4/3' }}>
          {imgLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-rose-200 border-t-rose-400 rounded-full animate-spin" />
            </div>
          )}
          {photoUrl && (
            <img
              src={photoUrl}
              alt={travel.location}
              className="w-full h-full object-cover"
              onLoad={() => setImgLoading(false)}
            />
          )}
          {!imgLoading && !photoUrl && (
            <div className="absolute inset-0 flex items-center justify-center text-rose-200">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
          )}
        </div>
      )}

      {/* Info */}
      <div className="px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {/* Location */}
            <div className="flex items-center gap-1.5 mb-1">
              <svg viewBox="0 0 24 24" fill="#fb7185" className="w-3.5 h-3.5 flex-shrink-0">
                <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.003 3.5-4.697 3.5-8.327a8 8 0 10-16 0c0 3.63 1.556 6.326 3.5 8.327a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold text-gray-700 truncate">{travel.location}</span>
            </div>

            {/* Caption */}
            {travel.caption && (
              <p className="text-sm text-gray-500 leading-relaxed mb-2">{travel.caption}</p>
            )}

            {/* Date */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-300">{full}</span>
              <span className="text-xs text-rose-200">{weekday}</span>
            </div>
          </div>

          {/* Delete button */}
          <button
            onClick={() => setShowConfirmDelete(true)}
            className="text-gray-200 active:text-red-300 transition-colors p-1 flex-shrink-0 mt-0.5"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
        </div>
      </div>

      {/* Confirm delete overlay */}
      {showConfirmDelete && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center gap-3 rounded-[1.25rem]">
          <p className="text-gray-600 text-sm font-medium">确定删除这条记录？</p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowConfirmDelete(false)}
              className="px-5 py-2 rounded-full border border-gray-200 text-gray-400 text-sm"
            >
              取消
            </button>
            <button
              onClick={() => onDelete(travel.id)}
              className="px-5 py-2 rounded-full bg-red-400 text-white text-sm"
            >
              删除
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
// Premium minimal face — Apple Face ID aesthetic
// Thin strokes, geometric precision, clean negative space
export default function DogIllustration({ className = '', size = 160 }) {
  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={className}
    >
      {/* Outer ring — very subtle depth layer */}
      <circle cx="80" cy="80" r="76" stroke="#fecdd3" strokeWidth="0.75" opacity="0.5" />

      {/* Face circle — thin, precise */}
      <circle cx="80" cy="80" r="58" stroke="#f472b6" strokeWidth="1.5" fill="#fff8f9" />

      {/* Left eye — upward arc, happy squint */}
      <path
        d="M50 76 Q60 66 70 76"
        stroke="#f472b6"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Right eye — upward arc, happy squint */}
      <path
        d="M90 76 Q100 66 110 76"
        stroke="#f472b6"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Smile — single clean arc */}
      <path
        d="M54 98 Q80 118 106 98"
        stroke="#f472b6"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Tiny heart — minimal accent, top center */}
      <path
        d="M77 44 Q80 40 83 44 Q86 40 83 37 Q80 34 77 37 Q74 40 77 44Z"
        fill="#fb7185"
        opacity="0.55"
      />
    </svg>
  )
}
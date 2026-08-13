// Replaced with a clean, minimal smiley face illustration
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
      {/* Outer glow ring */}
      <circle cx="80" cy="80" r="72" fill="#fecdd3" opacity="0.25" />

      {/* Face circle */}
      <circle cx="80" cy="80" r="58" fill="#fff1f2" stroke="#f472b6" strokeWidth="2.5" />

      {/* Left eye */}
      <circle cx="60" cy="68" r="6" fill="#f472b6" />
      <circle cx="62" cy="66" r="2" fill="white" />

      {/* Right eye */}
      <circle cx="100" cy="68" r="6" fill="#f472b6" />
      <circle cx="102" cy="66" r="2" fill="white" />

      {/* Smile */}
      <path
        d="M58 92 Q80 112 102 92"
        stroke="#f472b6"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Left cheek blush */}
      <ellipse cx="50" cy="88" rx="10" ry="7" fill="#fda4af" opacity="0.5" />

      {/* Right cheek blush */}
      <ellipse cx="110" cy="88" rx="10" ry="7" fill="#fda4af" opacity="0.5" />

      {/* Small heart above */}
      <path
        d="M76 38 Q80 33 84 38 Q88 33 84 29 Q80 25 76 29 Q72 33 76 38Z"
        fill="#fb7185"
        opacity="0.8"
      />
    </svg>
  )
}
export default function DogIllustration({ className = '', size = 160 }) {
  return (
    <svg
      viewBox="0 0 160 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={className}
    >
      {/* Tail – has wag animation applied via CSS on parent */}
      <g className="animate-wag" style={{ transformOrigin: '128px 130px' }}>
        <path
          d="M128 130 Q152 105 146 135"
          stroke="#f9a8d4"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* Body */}
      <ellipse cx="82" cy="145" rx="50" ry="36" fill="#fff1f2" stroke="#f472b6" strokeWidth="2.5" />

      {/* Left ear */}
      <path
        d="M52 68 Q30 30 56 58"
        fill="#fecdd3"
        stroke="#f472b6"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right ear */}
      <path
        d="M112 68 Q134 30 108 58"
        fill="#fecdd3"
        stroke="#f472b6"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Head */}
      <circle cx="82" cy="82" r="38" fill="#fff1f2" stroke="#f472b6" strokeWidth="2.5" />

      {/* Left eye */}
      <circle cx="68" cy="76" r="7" fill="#f472b6" />
      <circle cx="70" cy="74" r="2.5" fill="white" />
      {/* Right eye */}
      <circle cx="96" cy="76" r="7" fill="#f472b6" />
      <circle cx="98" cy="74" r="2.5" fill="white" />

      {/* Nose */}
      <ellipse cx="82" cy="91" rx="7" ry="5" fill="#f472b6" />

      {/* Mouth */}
      <path
        d="M75 96 Q82 104 89 96"
        stroke="#f472b6"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Left cheek blush */}
      <circle cx="56" cy="90" r="9" fill="#fecdd3" opacity="0.65" />
      {/* Right cheek blush */}
      <circle cx="108" cy="90" r="9" fill="#fecdd3" opacity="0.65" />

      {/* Collar */}
      <path
        d="M50 122 Q82 132 114 122"
        stroke="#fb7185"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Heart on collar */}
      <path
        d="M79 120 Q82 116 85 120 Q88 116 85 113 Q82 110 79 113 Q76 116 79 120Z"
        fill="#fb7185"
      />

      {/* Front paws */}
      <ellipse cx="62" cy="176" rx="12" ry="7" fill="#fff1f2" stroke="#f472b6" strokeWidth="2" />
      <ellipse cx="102" cy="176" rx="12" ry="7" fill="#fff1f2" stroke="#f472b6" strokeWidth="2" />
    </svg>
  )
}
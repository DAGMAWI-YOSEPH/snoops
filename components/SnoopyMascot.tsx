'use client'

interface Props {
  size?: number
  className?: string
}

export default function SnoopyMascot({ size = 80, className = '' }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Body */}
      <ellipse cx="60" cy="82" rx="28" ry="22" fill="white" stroke="black" strokeWidth="2.5" />
      {/* Tail */}
      <path d="M 86 74 Q 102 66 98 58 Q 94 52 88 58" stroke="black" strokeWidth="2.5" fill="white" strokeLinecap="round" />
      {/* Neck */}
      <ellipse cx="60" cy="58" rx="14" ry="8" fill="white" stroke="black" strokeWidth="2" />
      {/* Head */}
      <circle cx="60" cy="38" r="22" fill="white" stroke="black" strokeWidth="2.5" />
      {/* Left ear */}
      <ellipse cx="40" cy="30" rx="10" ry="17" fill="black" transform="rotate(-12 40 30)" />
      {/* Right ear */}
      <ellipse cx="80" cy="30" rx="10" ry="17" fill="black" transform="rotate(12 80 30)" />
      {/* Eye left */}
      <circle cx="52" cy="35" r="3" fill="black" />
      <circle cx="53" cy="34" r="1" fill="white" />
      {/* Eye right */}
      <circle cx="68" cy="35" r="3" fill="black" />
      <circle cx="69" cy="34" r="1" fill="white" />
      {/* Nose */}
      <ellipse cx="60" cy="43" rx="5" ry="3.5" fill="black" />
      {/* Smile */}
      <path d="M 53 48 Q 60 54 67 48" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Cheek dots */}
      <circle cx="46" cy="44" r="1.5" fill="black" opacity="0.3" />
      <circle cx="74" cy="44" r="1.5" fill="black" opacity="0.3" />
      {/* Collar */}
      <path d="M 47 58 Q 60 64 73 58" stroke="black" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Paw left */}
      <ellipse cx="40" cy="98" rx="8" ry="6" fill="white" stroke="black" strokeWidth="2" />
      <line x1="37" y1="102" x2="37" y2="104" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="40" y1="103" x2="40" y2="105" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="43" y1="102" x2="43" y2="104" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
      {/* Paw right */}
      <ellipse cx="80" cy="98" rx="8" ry="6" fill="white" stroke="black" strokeWidth="2" />
      <line x1="77" y1="102" x2="77" y2="104" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="80" y1="103" x2="80" y2="105" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="83" y1="102" x2="83" y2="104" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

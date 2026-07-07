import Link from 'next/link';

export function MirrorMark({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 96 112" role="img" aria-label="MIRROR crystal shield">
      <defs>
        <linearGradient id="mirrorShieldEdge" x1="18" y1="10" x2="78" y2="98" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F8FAFF" />
          <stop offset="0.22" stopColor="#A7C6FF" />
          <stop offset="0.52" stopColor="#1A2CFF" />
          <stop offset="0.78" stopColor="#6E5BFF" />
          <stop offset="1" stopColor="#F5F8FF" />
        </linearGradient>
        <linearGradient id="mirrorShieldCore" x1="26" y1="20" x2="70" y2="94" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F8FBFF" stopOpacity="0.95" />
          <stop offset="0.25" stopColor="#8FB4FF" stopOpacity="0.72" />
          <stop offset="0.56" stopColor="#17227A" stopOpacity="0.62" />
          <stop offset="1" stopColor="#050814" stopOpacity="0.92" />
        </linearGradient>
        <radialGradient id="mirrorShieldGlow" cx="50%" cy="78%" r="48%">
          <stop stopColor="#73D7FF" stopOpacity="0.72" />
          <stop offset="0.46" stopColor="#1A2CFF" stopOpacity="0.28" />
          <stop offset="1" stopColor="#050814" stopOpacity="0" />
        </radialGradient>
        <filter id="mirrorSoftGlow" x="-30%" y="-25%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.36 0 0 0 0 0.48 0 0 0 0 1 0 0 0 .72 0" />
          <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <ellipse cx="48" cy="100" rx="24" ry="7" fill="url(#mirrorShieldGlow)" opacity="0.95" />
      <path d="M48 7 78 26 69 78 48 105 27 78 18 26 48 7Z" fill="rgba(5,8,20,.78)" stroke="url(#mirrorShieldEdge)" strokeWidth="2.8" strokeLinejoin="round" filter="url(#mirrorSoftGlow)" />
      <path d="M48 10v92" stroke="rgba(255,255,255,.78)" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M48 10 29 28 48 39 67 28 48 10Z" fill="#F8FAFF" opacity="0.82" />
      <path d="M29 28 27 77 48 39Z" fill="#8FB4FF" opacity="0.5" />
      <path d="M67 28 69 77 48 39Z" fill="#6E5BFF" opacity="0.56" />
      <path d="M27 77 48 102 48 39Z" fill="#182A8B" opacity="0.72" />
      <path d="M69 77 48 102 48 39Z" fill="#071135" opacity="0.78" />
      <path d="M29 28 18 26 27 77m40-49 11-2-9 51M29 28l-2 49 21 25 21-25-2-49" fill="none" stroke="rgba(255,255,255,.42)" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M34 24 48 14 62 24M36 84l12 16 12-16" fill="none" stroke="rgba(255,255,255,.86)" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M48 103v6" stroke="#A7C6FF" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
    </svg>
  );
}

export function MirrorWordmark({ className = '' }: { className?: string }) {
  return <span className={'mirror-wordmark whitespace-nowrap ' + className}>MIRROR</span>;
}

export function MirrorLogo({ href = '/', className = '' }: { href?: string; className?: string }) {
  return <Link href={href} className={'mirror-logo inline-flex items-center gap-3 ' + className} aria-label="MIRROR home"><MirrorMark /><MirrorWordmark /></Link>;
}

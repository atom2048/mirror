import Link from 'next/link';

export function MirrorMark({ className = 'h-9 w-9' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 64 64" role="img" aria-label="MIRROR"><defs><linearGradient id="mirrorMarkGradient" x1="10" y1="6" x2="54" y2="58"><stop stopColor="#73D7FF"/><stop offset="0.52" stopColor="#7C3AED"/><stop offset="1" stopColor="#F472B6"/></linearGradient></defs><path d="M32 5 52 17v23L32 59 12 40V17L32 5Z" fill="rgba(7,12,28,.72)" stroke="url(#mirrorMarkGradient)" strokeWidth="3.2"/><path d="M32 10v44" stroke="rgba(255,255,255,.72)" strokeWidth="1.5" strokeLinecap="round"/><path d="M20 21 32 14l12 7-12 7-12-7Zm0 21 12 7 12-7-12-10-12 10Z" fill="url(#mirrorMarkGradient)" opacity=".88"/><path d="M18 32h28" stroke="rgba(255,255,255,.48)" strokeWidth="1.4" strokeLinecap="round"/></svg>;
}

export function MirrorWordmark({ className = '' }: { className?: string }) {
  return <span className={'mirror-wordmark whitespace-nowrap ' + className}>MIRROR</span>;
}

export function MirrorLogo({ href = '/', className = '' }: { href?: string; className?: string }) {
  return <Link href={href} className={'inline-flex items-center gap-3 ' + className} aria-label="MIRROR home"><MirrorMark /><MirrorWordmark /></Link>;
}

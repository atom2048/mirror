import type { MirrorCard } from '@mirror/core';
import { MirrorMark, MirrorWordmark } from './MirrorLogo';

export function MirrorCardView({ card }: { card: MirrorCard }) {
  return <div className="mirror-card relative overflow-hidden rounded-lg p-6" style={{ background: card.gradient }}><div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_20%,rgba(255,255,255,.34),transparent_28%),linear-gradient(180deg,rgba(255,255,255,.16),rgba(255,255,255,.02))]" /><div className="relative flex h-full flex-col justify-between"><div className="flex items-start justify-between gap-4"><div><p className="text-xs tracking-[.25em] text-white/75">{card.dateKey}</p><h2 className="mt-4 text-3xl font-semibold tracking-normal">{card.title}</h2></div><MirrorMark className="h-10 w-10 shrink-0 drop-shadow-[0_0_18px_rgba(115,215,255,.45)]" /></div><div><p className="text-xl leading-relaxed text-white">{card.statsText}</p><p className="mt-5 text-sm leading-6 text-white/78">{card.copy}</p></div><div className="flex items-center justify-between gap-3 text-xs text-white/70"><MirrorWordmark className="text-[10px]" /><span className="tracking-[.32em]">#MIRROR</span></div></div></div>;
}

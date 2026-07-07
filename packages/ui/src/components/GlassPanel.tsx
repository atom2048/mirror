import type { ReactNode } from 'react';
export function GlassPanel({ children, className = '' }: { children: ReactNode; className?: string }) { return <section className={'rounded-lg border border-white/12 bg-white/[0.07] p-4 shadow-2xl shadow-black/20 backdrop-blur-xl ' + className}>{children}</section>; }

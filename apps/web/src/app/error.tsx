'use client';
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) { return <main className="mx-auto max-w-xl px-4 py-24 text-center"><h1 className="text-3xl font-semibold">鏡面が少し曇りました</h1><p className="mt-3 text-white/60">もう一度だけ、焦点を合わせ直します。</p><button onClick={reset} className="mt-6 rounded-lg bg-white px-4 py-2 text-slate-950">再試行</button></main>; }

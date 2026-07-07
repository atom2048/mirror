import Link from 'next/link';
export default function NotFound() { return <main className="mx-auto max-w-xl px-4 py-24 text-center"><h1 className="text-3xl font-semibold">反射が見つかりません</h1><p className="mt-3 text-white/60">その断片は非公開か、もう消えたのかもしれません。</p><Link href="/home" className="mt-6 inline-flex rounded-lg bg-white px-4 py-2 text-slate-950">Homeへ</Link></main>; }

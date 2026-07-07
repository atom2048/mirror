import type { Metadata, Viewport } from 'next';
import '../styles/globals.css';
export const metadata: Metadata = { title: 'MIRROR', description: '世界のどこかに、今日のあなたと似た人がいる。', manifest: '/manifest.json', appleWebApp: { capable: true, title: 'MIRROR', statusBarStyle: 'black-translucent' } };
export const viewport: Viewport = { themeColor: '#050814', width: 'device-width', initialScale: 1, viewportFit: 'cover' };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="ja"><body><div className="mirror-noise" />{children}</body></html>; }

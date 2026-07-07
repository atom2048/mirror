import type { Metadata, Viewport } from 'next';
import { I18nProvider } from '@/lib/i18n/I18nProvider';
import '../styles/globals.css';

export const metadata: Metadata = { title: 'MIRROR', description: '世界のどこかに、今日のあなたと似た人がいる。', manifest: '/manifest.json', appleWebApp: { capable: true, title: 'MIRROR', statusBarStyle: 'black-translucent' } };
export const viewport: Viewport = { themeColor: '#050814', width: 'device-width', initialScale: 1, viewportFit: 'cover' };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="ja" dir="ltr"><body><I18nProvider><div className="mirror-noise" />{children}</I18nProvider></body></html>; }

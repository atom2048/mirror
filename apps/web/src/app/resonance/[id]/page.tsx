import { MirrorAppShell } from '@/components/MirrorAppShell';
export default async function Page({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <MirrorAppShell view="resonance-detail" id={id} />; }

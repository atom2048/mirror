'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, LogOut, Share2, ShieldAlert, Sparkles, UserRound, Wand2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { generateMirrorCard, generateResonanceText, scorePulseMatch, type MirrorCard, type Pulse, type PulseDraft, type Resonance } from '@mirror/core';
import { blockUser, completeOnboarding, createMirrorCard, createPulse, createReport, createResonance, deletePulse, findCandidatePulses, getPulse, getResonance, listPublicPulseFragments, listUserMirrorCards, listUserPulses, listUserResonances, logout, makePulsePrivate, signInAnonymous, signInWithGoogle } from '@mirror/firebase';
import { SUPPORTED_LOCALES, type LocaleCode, useI18n } from '@/lib/i18n';
import { PulseForm } from './PulseForm';
import { MirrorCardView } from './MirrorCardView';
import { MirrorLogo, MirrorMark, MirrorWordmark } from './MirrorLogo';
import { useFirebaseUser } from '../hooks/useFirebaseUser';
import type { MirrorView } from '../lib/routes';

type Status = { kind: 'idle'|'loading'|'error'|'done'; message: string };

export function MirrorAppShell({ view, id }: { view: MirrorView; id?: string }) {
  const router = useRouter();
  const { t, locale, setLocale } = useI18n();
  const { user, loading, configured } = useFirebaseUser();
  const [status, setStatus] = useState<Status>({ kind:'idle', message:'' });
  const [pulses, setPulses] = useState<Pulse[]>([]);
  const [resonances, setResonances] = useState<Resonance[]>([]);
  const [cards, setCards] = useState<MirrorCard[]>([]);
  const [selectedPulse, setSelectedPulse] = useState<Pulse | null>(null);
  const [selectedResonance, setSelectedResonance] = useState<Resonance | null>(null);
  const [publicPulses, setPublicPulses] = useState<Pulse[]>([]);
  const latestCard = cards[0];

  const refresh = useCallback(async (uid: string) => {
    try {
      const [ps, rs, cs, publicFragments] = await Promise.all([listUserPulses(uid), listUserResonances(uid), listUserMirrorCards(uid), listPublicPulseFragments({ excludeUid: uid, max: 18 })]);
      setPulses(ps);
      setResonances(rs);
      setCards(cs);
      setPublicPulses(publicFragments);
    } catch (e) {
      setStatus({ kind:'error', message:e instanceof Error ? e.message : t('error.read') });
    }
  }, [t]);

  useEffect(() => { if (!user) return; void refresh(user.uid); }, [user, refresh]);
  useEffect(() => {
    if (!id) return;
    if (view === 'pulse-detail') getPulse(id).then(setSelectedPulse).catch((e) => setStatus({ kind:'error', message:e.message }));
    if (view === 'resonance-detail') getResonance(id).then(setSelectedResonance).catch((e) => setStatus({ kind:'error', message:e.message }));
  }, [id, view]);

  async function ensureUser() {
    if (user) return user;
    setStatus({ kind:'loading', message:t('status.anonymous') });
    return await signInAnonymous();
  }

  async function submitPulse(draft: PulseDraft) {
    try {
      const current = await ensureUser();
      const pulse = await createPulse(current.uid, draft);
      const candidates = await findCandidatePulses(pulse, 40);
      const scored = candidates.map((candidate) => ({ pulse: candidate, result: scorePulseMatch(pulse, candidate, []) })).filter((item) => item.result.matched).sort((a,b) => b.result.score - a.result.score).slice(0, 20);
      const text = generateResonanceText({ color: pulse.color, mood: pulse.mood, count: scored.length, strongCount: scored.filter((s) => s.result.strong).length });
      const resonance = await createResonance({ pulseId: pulse.id, uid: current.uid, dateKey: pulse.dateKey, matchedPulseIds: scored.slice(0, 20).map((s) => s.pulse.id), matchCount: scored.length, dominantMatchTypes: Array.from(new Set(scored.flatMap((s) => s.result.matchTypes))).slice(0, 5), score: scored[0]?.result.score || 0, title: text.title, body: text.body });
      const draftCard = generateMirrorCard({ uid: current.uid, pulseId: pulse.id, resonanceId: resonance.id, dateKey: pulse.dateKey, color: pulse.color, mood: t('moods.' + pulse.mood), matchCount: scored.length });
      const colorLabel = t('colors.' + pulse.color);
      const card = await createMirrorCard({ uid: draftCard.uid, pulseId: draftCard.pulseId, resonanceId: draftCard.resonanceId, dateKey: draftCard.dateKey, title: t('mirrorCard.title'), copy: t('mirrorCard.copy', { mood: t('moods.' + pulse.mood) }), color: draftCard.color, gradient: draftCard.gradient, statsText: scored.length > 0 ? t('mirrorCard.stats.matched', { color: colorLabel, count: scored.length }) : t('mirrorCard.stats.empty', { color: colorLabel }) });
      await completeOnboarding(current.uid);
      setPulses((prev) => [pulse, ...prev]);
      setResonances((prev) => [resonance, ...prev]);
      setCards((prev) => [card, ...prev]);
      setStatus({ kind:'done', message:t('status.synced') });
      router.push('/mirror');
    } catch (e) {
      setStatus({ kind:'error', message:e instanceof Error ? e.message : t('error.pulseSave') });
    }
  }

  async function connectGoogle() {
    try {
      const next = await signInWithGoogle();
      if (!next) {
        setStatus({ kind:'loading', message:t('status.googleRedirect') });
        return;
      }
      await refresh(next.uid);
      setStatus({ kind:'done', message:t('status.googleLinked') });
    } catch (e) {
      setStatus({ kind:'error', message:e instanceof Error ? e.message : t('error.googleSignIn') });
    }
  }

  async function shareCard(card: MirrorCard) {
    const text = t('share.copy', { text: card.statsText });
    if (navigator.share) await navigator.share({ title: 'MIRROR', text });
    else await navigator.clipboard.writeText(text);
    setStatus({ kind:'done', message:t('common.share') });
  }

  const cityMood = useMemo(() => {
    const today = pulses[0]?.dateKey;
    const todayPulses = pulses.filter((p) => p.dateKey === today);
    return { count: todayPulses.length, color: todayPulses[0]?.color || 'Blue', mood: todayPulses[0]?.mood || '静けさ' };
  }, [pulses]);

  return <main className="relative min-h-screen"><Header />
    <div className="mx-auto w-full max-w-5xl px-4 pb-16">
      {status.message && <div className={'mb-4 rounded-lg border px-4 py-3 text-sm ' + (status.kind === 'error' ? 'border-red-300/25 bg-red-500/10 text-red-100' : 'border-white/14 bg-white/8 text-white/78')}>{status.message}</div>}
      {!configured && <SetupNotice />}
      {loading && <EmptyState title={t('common.loading')} body={t('common.loadingBody')} />}
      {view === 'landing' && <Landing onStart={() => router.push('/start')} />}
      {view === 'start' && <Start onSubmit={submitPulse} />}
      {view === 'mirror' && <Mirror latestCard={latestCard} latestResonance={resonances[0]} onShare={shareCard} onGoogle={connectGoogle} userAnonymous={Boolean(user?.isAnonymous)} />}
      {view === 'home' && <Home userReady={Boolean(user)} pulses={pulses} resonances={resonances} latestCard={latestCard} cityMood={cityMood} publicPulses={publicPulses} onSubmit={submitPulse} />}
      {view === 'pulse-new' && <Start onSubmit={submitPulse} title={t('start.todayTitle')} />}
      {view === 'pulse-detail' && <PulseDetail pulse={selectedPulse} currentUid={user?.uid} onPrivate={async () => selectedPulse && makePulsePrivate(selectedPulse.id).then(() => router.push('/me'))} onDelete={async () => selectedPulse && deletePulse(selectedPulse.id).then(() => router.push('/me'))} />}
      {view === 'resonance-detail' && <ResonanceDetail resonance={selectedResonance} />}
      {view === 'city' && <City pulses={pulses} publicPulses={publicPulses} userReady={Boolean(user)} onUnlock={async () => { const current = await ensureUser(); await refresh(current.uid); }} cityMood={cityMood} />}
      {view === 'me' && <Me pulses={pulses} cards={cards} resonances={resonances} />}
      {view === 'settings' && <Settings onGoogle={connectGoogle} onLogout={logout} onBlock={async (target) => { if (!user) return; await blockUser(user.uid, target); }} isAnonymous={Boolean(user?.isAnonymous)} locale={locale} setLocale={setLocale} />}
      {view === 'report' && <ReportForm userId={user?.uid} onReport={async (targetType, targetId, reason, details) => { const current = user || await ensureUser(); await createReport({ reporterUid: current.uid, targetType, targetId, reason, details }); setStatus({ kind:'done', message:t('status.reported') }); }} />}
    </div>
  </main>;
}

function Header() {
  const { t } = useI18n();
  return <nav className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-5"><MirrorLogo /><div className="flex flex-wrap items-center justify-end gap-3 text-sm text-white/70"><Link href="/home" className="hover:text-white">{t('nav.home')}</Link><Link href="/city" className="hover:text-white">{t('city.title')}</Link><Link href="/me" className="hover:text-white">{t('nav.log')}</Link><Link href="/settings" className="hover:text-white">{t('nav.settings')}</Link></div></nav>;
}
function SetupNotice() { const { t } = useI18n(); return <div className="mb-6 rounded-lg border border-amber-200/20 bg-amber-300/10 p-4 text-sm text-amber-50">{t('setup.notice')}</div>; }
function Landing({ onStart }: { onStart: () => void }) { const { t } = useI18n(); return <section className="grid min-h-[78vh] items-center gap-8 py-8 lg:grid-cols-[1fr_.8fr]"><div><div className="mb-7 flex items-center gap-4"><MirrorMark className="h-14 w-14 drop-shadow-[0_0_26px_rgba(115,215,255,.5)]" /><div><p className="text-sm tracking-[.28em] text-blue-100/70">{t('brand.kicker')}</p><MirrorWordmark className="mt-2 block text-5xl sm:text-7xl" /></div></div><p className="mt-5 max-w-xl text-xl leading-9 text-white/82">{t('app.tagline')}</p><p className="mt-8 max-w-2xl text-base leading-8 text-white/62">{t('landing.body')}</p><button onClick={onStart} className="mt-9 inline-flex min-h-12 items-center gap-2 rounded-lg bg-white px-5 py-3 font-medium text-slate-950 transition hover:bg-blue-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-200 active:scale-[0.99]"><Wand2 size={18}/>{t('landing.cta')}</button></div><div className="rounded-lg border border-white/14 bg-white/[.07] p-5 backdrop-blur-xl"><div className="relative overflow-hidden rounded-lg bg-[linear-gradient(135deg,#07142d,#4C1D95_58%,#73D7FF)] p-6 shadow-2xl"><div className="absolute right-5 top-5 opacity-70"><MirrorMark className="h-16 w-16" /></div><p className="text-xs tracking-[.3em] text-white/70">{t('landing.cardKicker')}</p><p className="mt-32 text-2xl leading-9">{t('landing.cardCopy')}</p></div></div></section>; }
function Start({ onSubmit, title }: { onSubmit: (draft: PulseDraft) => Promise<void>; title?: string }) { const { t } = useI18n(); return <section className="mx-auto max-w-2xl py-8"><p className="text-sm tracking-[.24em] text-blue-100/70">{t('start.kicker')}</p><h1 className="mt-4 text-4xl font-semibold">{title || t('start.title')}</h1><p className="mt-3 text-white/62">{t('start.body')}</p><div className="mt-8 rounded-lg border border-white/14 bg-white/[.07] p-5 backdrop-blur-xl"><PulseForm onSubmit={onSubmit} /></div></section>; }
function Mirror({ latestCard, latestResonance, onShare, onGoogle, userAnonymous }: { latestCard?: MirrorCard; latestResonance?: Resonance; onShare: (card: MirrorCard) => void; onGoogle: () => void; userAnonymous: boolean }) { const { t } = useI18n(); return <section className="grid gap-8 py-8 lg:grid-cols-[.8fr_1fr]"><div>{latestCard ? <MirrorCardView card={latestCard}/> : <EmptyState title={t('mirror.emptyTitle')} body={t('mirror.emptyBody')} />}</div><div className="self-center"><p className="text-sm tracking-[.24em] text-pink-100/70">{t('mirror.kicker')}</p><h1 className="mt-4 text-4xl font-semibold">{latestResonance ? t('mirror.fallbackTitle') : t('mirror.fallbackTitle')}</h1><p className="mt-5 leading-8 text-white/68">{latestResonance ? t('mirrorCard.stats.matched', { color: 'MIRROR', count: latestResonance.matchCount }) : t('mirror.fallbackBody')}</p><div className="mt-8 flex flex-wrap gap-3">{latestCard && <button onClick={() => onShare(latestCard)} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-white px-4 text-sm font-medium text-slate-950"><Share2 size={16}/>{t('common.share')}</button>}{userAnonymous && <button onClick={onGoogle} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/15 px-4 text-sm text-white"><UserRound size={16}/>{t('common.saveWithGoogle')}</button>}<Link href="/home" className="inline-flex min-h-11 items-center rounded-lg border border-white/15 px-4 text-sm text-white">{t('common.home')}</Link></div></div></section>; }
function Home({ userReady, pulses, resonances, latestCard, cityMood, publicPulses, onSubmit }: { userReady: boolean; pulses: Pulse[]; resonances: Resonance[]; latestCard?: MirrorCard; cityMood: { count:number; color:string; mood:string }; publicPulses: Pulse[]; onSubmit: (draft: PulseDraft) => Promise<void> }) { const { t } = useI18n(); return <section className="grid gap-6 py-6 lg:grid-cols-[1fr_.8fr]"><div><h1 className="text-3xl font-semibold">{t('home.title')}</h1><p className="mt-2 text-white/62">{userReady ? t('home.ready') : t('home.guest')}</p><div className="mt-6 rounded-lg border border-white/14 bg-white/[.07] p-5"><PulseForm onSubmit={onSubmit} compact /></div><div className="mt-6 rounded-lg border border-white/14 bg-white/[.07] p-5"><h2 className="font-medium">{t('home.recent')}</h2>{pulses.length === 0 ? <p className="mt-3 text-sm text-white/55">{t('home.noPulse')}</p> : <div className="mt-3 space-y-2">{pulses.slice(0,5).map((p) => <Link key={p.id} href={'/pulse/' + p.id} className="block rounded-lg border border-white/10 px-3 py-2 text-sm text-white/75">{p.dateKey} / {t('colors.' + p.color)} / {t('moods.' + p.mood)} / {p.word}</Link>)}</div>}</div></div><div className="space-y-6">{latestCard && <MirrorCardView card={latestCard}/>}<div className="rounded-lg border border-white/14 bg-white/[.07] p-5"><h2 className="font-medium">{t('city.title')}</h2><p className="mt-4 text-2xl">{t('colors.' + cityMood.color)} / {t('moods.' + cityMood.mood)}</p><p className="mt-2 text-sm text-white/58">{t('city.body')}</p><Link href="/city" className="mt-4 inline-flex text-sm text-blue-100">{t('city.link')}</Link></div><AnonymousFragments pulses={publicPulses.slice(0,3)} compact /></div></section>; }
function PulseDetail({ pulse, currentUid, onPrivate, onDelete }: { pulse: Pulse | null; currentUid?: string; onPrivate: () => void; onDelete: () => void }) { const { t } = useI18n(); if (!pulse) return <EmptyState title={t('pulse.emptyTitle')} body={t('pulse.emptyBody')} />; const canManage = pulse.uid === currentUid; return <section className="mx-auto max-w-2xl py-8"><p className="text-xs tracking-[.28em] text-blue-100/60">{canManage ? t('pulse.ownFragment') : t('pulse.anonymousFragment')}</p><h1 className="mt-3 text-3xl font-semibold">{t('colors.' + pulse.color)} / {t('moods.' + pulse.mood)}</h1><p className="mt-5 rounded-lg border border-white/14 bg-white/[.07] p-5 text-xl leading-9">{pulse.word}</p><div className="mt-5 flex flex-wrap gap-3">{canManage && <button onClick={onPrivate} className="rounded-lg border border-white/15 px-4 py-2 text-sm">{t('common.private')}</button>}{canManage && <button onClick={onDelete} className="rounded-lg border border-red-200/25 px-4 py-2 text-sm text-red-100">{t('common.delete')}</button>}<Link href={'/report?targetType=pulse&targetId=' + pulse.id} className="rounded-lg border border-white/15 px-4 py-2 text-sm">{t('common.report')}</Link></div></section>; }
function ResonanceDetail({ resonance }: { resonance: Resonance | null }) { const { t } = useI18n(); return <section className="mx-auto max-w-2xl py-8"><Sparkles/><h1 className="mt-4 text-3xl font-semibold">{resonance?.title || t('resonance.title')}</h1><p className="mt-5 leading-8 text-white/68">{resonance?.body || t('resonance.loading')}</p></section>; }
function City({ pulses, publicPulses, cityMood, userReady, onUnlock }: { pulses: Pulse[]; publicPulses: Pulse[]; cityMood: { count:number; color:string; mood:string }; userReady: boolean; onUnlock: () => Promise<void> }) { const { t } = useI18n(); return <section className="py-8"><h1 className="text-3xl font-semibold">{t('city.title')}</h1><p className="mt-3 max-w-2xl text-white/62">{t('city.body')}</p><div className="mt-8 grid gap-4 sm:grid-cols-3"><Metric label={t('city.dominant')} valueText={t('colors.' + cityMood.color)}/><Metric label={t('city.mood')} valueText={t('moods.' + cityMood.mood)}/><Metric label={t('city.yourPulses')} valueText={String(pulses.length)}/></div>{userReady ? <AnonymousFragments pulses={publicPulses} /> : <div className="mt-8 rounded-lg border border-white/14 bg-white/[.07] p-6"><Eye className="text-blue-100"/><h2 className="mt-4 text-xl font-medium">{t('fragments.lockedTitle')}</h2><p className="mt-2 text-sm leading-6 text-white/58">{t('fragments.lockedBody')}</p><button onClick={onUnlock} className="mt-5 min-h-11 rounded-lg bg-white px-4 text-sm font-medium text-slate-950">{t('fragments.unlock')}</button></div>}</section>; }
function Me({ pulses, cards, resonances }: { pulses: Pulse[]; cards: MirrorCard[]; resonances: Resonance[] }) { const { t } = useI18n(); return <section className="py-8"><h1 className="text-3xl font-semibold">{t('me.title')}</h1><div className="mt-6 grid gap-4 sm:grid-cols-3"><Metric label={t('me.pulses')} valueText={String(pulses.length)}/><Metric label={t('me.cards')} valueText={String(cards.length)}/><Metric label={t('me.resonances')} valueText={String(resonances.length)}/></div><div className="mt-8 grid gap-4 lg:grid-cols-2">{cards.slice(0,2).map((c) => <MirrorCardView key={c.id} card={c}/>)}{pulses.map((p) => <Link key={p.id} href={'/pulse/' + p.id} className="rounded-lg border border-white/14 bg-white/[.07] p-4"><p className="text-sm text-white/50">{p.dateKey} / {t('colors.' + p.color)}</p><p className="mt-2">{p.word}</p></Link>)}</div></section>; }

function AnonymousFragments({ pulses, compact = false }: { pulses: Pulse[]; compact?: boolean }) { const { t } = useI18n(); return <div className="rounded-lg border border-white/14 bg-white/[.07] p-5"><div className="flex items-start justify-between gap-4"><div><p className="text-xs tracking-[.28em] text-blue-100/60">{t('fragments.kicker')}</p><h2 className="mt-2 font-medium">{t('fragments.title')}</h2></div><Eye size={18} className="text-blue-100/70" /></div><p className="mt-3 text-sm leading-6 text-white/55">{t('fragments.body')}</p>{pulses.length === 0 ? <p className="mt-5 rounded-lg border border-white/10 px-3 py-3 text-sm text-white/52">{t('fragments.empty')}</p> : <div className={compact ? 'mt-4 space-y-2' : 'mt-5 grid gap-3 md:grid-cols-2'}>{pulses.slice(0, compact ? 3 : 12).map((pulse) => <Link key={pulse.id} href={'/pulse/' + pulse.id} className="mirror-fragment block rounded-lg border border-white/10 bg-white/[.045] p-4 transition hover:border-blue-100/35 hover:bg-white/[.075]"><p className="text-xs text-white/45">{pulse.dateKey} / {t('colors.' + pulse.color)} / {t('moods.' + pulse.mood)} / {t('places.' + pulse.placeCategory)}</p><p className="mt-3 line-clamp-3 text-sm leading-6 text-white/76">{pulse.word}</p><p className="mt-3 text-xs text-blue-100/62">{t('fragments.open')}</p></Link>)}</div>} {!compact && <p className="mt-4 text-xs leading-5 text-white/42">{t('fragments.privacy')}</p>}</div>; }
function Metric({ label, valueText }: { label:string; valueText:string }) { return <div className="rounded-lg border border-white/14 bg-white/[.07] p-5"><p className="text-sm text-white/50">{label}</p><p className="mt-2 break-words text-3xl">{valueText}</p></div>; }
function Settings({ onGoogle, onLogout, onBlock, isAnonymous, locale, setLocale }: { onGoogle: () => void; onLogout: () => void; onBlock: (target:string) => Promise<void>; isAnonymous:boolean; locale: LocaleCode; setLocale: (locale: LocaleCode) => void }) { const { t } = useI18n(); const [target, setTarget] = useState(''); return <section className="mx-auto max-w-2xl py-8"><h1 className="text-3xl font-semibold">{t('settings.title')}</h1><div className="mt-6 space-y-5 rounded-lg border border-white/14 bg-white/[.07] p-5"><p className="text-white/62">{t('settings.privacy')}</p><label className="block text-sm text-white/72">{t('settings.language')}<select className="field mt-2" value={locale} onChange={(event) => setLocale(event.target.value as LocaleCode)}>{SUPPORTED_LOCALES.map((item) => <option key={item.code} value={item.code}>{t(item.labelKey)}</option>)}</select></label>{isAnonymous && <button onClick={onGoogle} className="min-h-11 rounded-lg bg-white px-4 text-sm text-slate-950">{t('common.saveWithGoogle')}</button>}<div><label className="text-sm text-white/70">{t('settings.blockUid')}<input className="field mt-2" value={target} onChange={(e) => setTarget(e.target.value)} /></label><button onClick={() => target && onBlock(target)} className="mt-3 rounded-lg border border-white/15 px-4 py-2 text-sm">{t('settings.block')}</button></div><button onClick={onLogout} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/15 px-4 text-sm"><LogOut size={16}/>{t('common.logout')}</button></div></section>; }
function ReportForm({ userId, onReport }: { userId?: string; onReport: (targetType:'pulse'|'user'|'resonance', targetId:string, reason:string, details?:string) => Promise<void> }) { const { t } = useI18n(); const [targetType, setTargetType] = useState<'pulse'|'user'|'resonance'>('pulse'); const [targetId, setTargetId] = useState(''); const [reason, setReason] = useState('harassment'); const [details, setDetails] = useState(''); return <section className="mx-auto max-w-2xl py-8"><ShieldAlert/><h1 className="mt-4 text-3xl font-semibold">{t('report.title')}</h1><p className="mt-3 text-white/62">{t('report.body')}</p><div className="mt-6 space-y-4 rounded-lg border border-white/14 bg-white/[.07] p-5"><select className="field" value={targetType} onChange={(e) => setTargetType(e.target.value as 'pulse'|'user'|'resonance')}><option value="pulse">pulse</option><option value="user">user</option><option value="resonance">resonance</option></select><input className="field" value={targetId} onChange={(e) => setTargetId(e.target.value)} placeholder={t('report.targetId')}/><input className="field" value={reason} onChange={(e) => setReason(e.target.value)} placeholder={t('report.reason')}/><textarea className="field min-h-28" value={details} onChange={(e) => setDetails(e.target.value)} placeholder={t('report.details')}/><button disabled={!userId && !targetId} onClick={() => onReport(targetType, targetId, reason, details)} className="min-h-11 rounded-lg bg-white px-4 text-sm text-slate-950 disabled:opacity-40">{t('common.send')}</button></div></section>; }
function EmptyState({ title, body }: { title:string; body:string }) { return <div className="rounded-lg border border-white/14 bg-white/[.07] p-8 text-center"><h2 className="text-2xl font-semibold">{title}</h2><p className="mt-3 leading-7 text-white/58">{body}</p></div>; }

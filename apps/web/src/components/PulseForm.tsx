'use client';
import { useState } from 'react';
import { MOODS, PLACE_CATEGORIES, PULSE_COLORS, type PulseDraft } from '@mirror/core';
import { getDateKey, getTimeSlot } from '@mirror/core';
import { ColorPicker } from './ColorPicker';
import { useI18n } from '@/lib/i18n/useI18n';

export function PulseForm({ onSubmit, compact = false }: { onSubmit: (draft: PulseDraft) => Promise<void>; compact?: boolean }) {
  const { t } = useI18n();
  const [color, setColor] = useState(PULSE_COLORS[0]);
  const [mood, setMood] = useState(MOODS[0]);
  const [word, setWord] = useState('');
  const [placeCategory, setPlace] = useState(PLACE_CATEGORIES[0]);
  const [visibility, setVisibility] = useState<'anonymousPublic'|'private'>('anonymousPublic');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await onSubmit({ dateKey: getDateKey(), timeSlot: getTimeSlot(), color, mood, word, placeCategory, visibility });
      setWord('');
    } finally {
      setBusy(false);
    }
  }

  return <form onSubmit={submit} className="space-y-5"><div><label className="mb-3 block text-sm text-white/72">{t('pulse.colorLabel')}</label><ColorPicker value={color} onChange={setColor} disabled={busy} /></div><div className="grid gap-3 sm:grid-cols-2"><label className="block text-sm text-white/72">{t('pulse.moodLabel')}<select className="field mt-2" value={mood} onChange={(e) => setMood(e.target.value)} disabled={busy}>{MOODS.map((m) => <option key={m} value={m}>{t('moods.' + m)}</option>)}</select></label><label className="block text-sm text-white/72">{t('pulse.placeLabel')}<select className="field mt-2" value={placeCategory} onChange={(e) => setPlace(e.target.value)} disabled={busy}>{PLACE_CATEGORIES.map((p) => <option key={p} value={p}>{t('places.' + p)}</option>)}</select></label></div><label className="block text-sm text-white/72">{t('pulse.wordLabel')}<textarea className="field mt-2 min-h-24 resize-none" maxLength={80} value={word} onChange={(e) => setWord(e.target.value)} placeholder={t('pulse.wordPlaceholder')} required disabled={busy} /></label>{!compact && <label className="flex items-center gap-3 text-sm text-white/72"><input type="checkbox" checked={visibility === 'private'} onChange={(e) => setVisibility(e.target.checked ? 'private' : 'anonymousPublic')} disabled={busy} />{t('pulse.privateLabel')}</label>}<button disabled={busy || word.trim().length === 0} className="min-h-12 w-full rounded-lg bg-white px-5 py-3 font-medium text-slate-950 transition hover:bg-blue-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-200 active:scale-[0.99] disabled:opacity-40">{busy ? t('pulse.submitting') : t('pulse.submit')}</button></form>;
}

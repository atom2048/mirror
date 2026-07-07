'use client';
import { Check } from 'lucide-react';
import { PULSE_COLOR_META, PULSE_COLORS, type PulseColor } from '@mirror/core';
import { useI18n } from '@/lib/i18n/useI18n';

export function ColorPicker({ value, onChange, disabled = false }: { value: PulseColor; onChange: (color: PulseColor) => void; disabled?: boolean }) {
  const { t } = useI18n();
  return <div className="grid grid-cols-2 gap-3 sm:grid-cols-5" role="radiogroup" aria-label={t('pulse.colorLabel')}>{PULSE_COLORS.map((color) => { const meta = PULSE_COLOR_META[color]; const selected = value === color; return <button key={color} type="button" role="radio" aria-checked={selected} aria-label={t('colors.' + color)} disabled={disabled} onClick={() => onChange(color)} className={'color-swatch-button group ' + (selected ? 'is-selected' : '')}><span className="color-swatch-orb" style={{ background: meta.gradient }}><span className="color-swatch-glass" />{selected && <span className="color-swatch-check"><Check size={14} strokeWidth={3} /></span>}</span><span className="min-w-0 text-center text-xs font-medium text-white/78 transition group-hover:text-white">{t('colors.' + color)}</span></button>; })}</div>;
}

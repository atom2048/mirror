import type { PulseColor, TimeSlot, Visibility } from '../types';

export const PULSE_COLORS: PulseColor[] = ['Blue','Red','Yellow','Green','Purple','White','Black','Orange','Pink','Gray'];
export const MOODS = ['静けさ','疲れ','期待','不安','余白','孤独','やさしさ','熱','透明','眠気'];
export const PLACE_CATEGORIES = ['home','station','school','office','street','cafe','train','park','other'];
export const VISIBILITIES: Visibility[] = ['anonymousPublic','private'];
export const TIME_SLOTS: TimeSlot[] = ['morning','day','evening','night','lateNight'];

export const PULSE_COLOR_META: Record<PulseColor, { label: PulseColor; hex: string; gradient: string }> = {
  Blue: { label: 'Blue', hex: '#4F7CFF', gradient: 'linear-gradient(135deg, #1A2CFF, #73D7FF)' },
  Red: { label: 'Red', hex: '#E94444', gradient: 'linear-gradient(135deg, #7F1D1D, #FB7185)' },
  Yellow: { label: 'Yellow', hex: '#FACC15', gradient: 'linear-gradient(135deg, #F59E0B, #FEF08A)' },
  Green: { label: 'Green', hex: '#34D399', gradient: 'linear-gradient(135deg, #047857, #6EE7B7)' },
  Purple: { label: 'Purple', hex: '#7C3AED', gradient: 'linear-gradient(135deg, #4C1D95, #A78BFA)' },
  White: { label: 'White', hex: '#F8FAFC', gradient: 'linear-gradient(135deg, #CBD5E1, #FFFFFF)' },
  Black: { label: 'Black', hex: '#020617', gradient: 'linear-gradient(135deg, #020617, #334155)' },
  Orange: { label: 'Orange', hex: '#FB923C', gradient: 'linear-gradient(135deg, #C2410C, #FDBA74)' },
  Pink: { label: 'Pink', hex: '#F472B6', gradient: 'linear-gradient(135deg, #BE185D, #FBCFE8)' },
  Gray: { label: 'Gray', hex: '#64748B', gradient: 'linear-gradient(135deg, #334155, #CBD5E1)' },
};

export const COLOR_HEX: Record<PulseColor, string> = Object.fromEntries(PULSE_COLORS.map((color) => [color, PULSE_COLOR_META[color].hex])) as Record<PulseColor, string>;
export const COLOR_GRADIENTS: Record<PulseColor, string> = Object.fromEntries(PULSE_COLORS.map((color) => [color, PULSE_COLOR_META[color].gradient])) as Record<PulseColor, string>;

import type { PulseColor, TimeSlot, Visibility } from '../types';
export const PULSE_COLORS: PulseColor[] = ['Blue','Red','Yellow','Green','Purple','White','Black','Orange','Pink','Gray'];
export const MOODS = ['静けさ','疲れ','期待','不安','余白','孤独','やさしさ','熱','透明','眠気'];
export const PLACE_CATEGORIES = ['home','station','school','office','street','cafe','train','park','other'];
export const VISIBILITIES: Visibility[] = ['anonymousPublic','private'];
export const TIME_SLOTS: TimeSlot[] = ['morning','day','evening','night','lateNight'];
export const COLOR_HEX: Record<PulseColor, string> = { Blue:'#6aa7ff', Red:'#ff6b7a', Yellow:'#ffe08a', Green:'#88d8a3', Purple:'#b79cff', White:'#f6f7fb', Black:'#151823', Orange:'#ffb26b', Pink:'#ff9fc7', Gray:'#9aa4b2' };
export const COLOR_GRADIENTS: Record<PulseColor, string> = { Blue:'linear-gradient(135deg,#07142d,#2367d8 55%,#c5dcff)', Red:'linear-gradient(135deg,#25080f,#a8324d 55%,#ffd0d6)', Yellow:'linear-gradient(135deg,#201600,#b8891b 55%,#fff2bd)', Green:'linear-gradient(135deg,#061d17,#2b8d6a 55%,#c9ffe3)', Purple:'linear-gradient(135deg,#120928,#5c3bb9 55%,#dfd2ff)', White:'linear-gradient(135deg,#111827,#dfe7f5 55%,#ffffff)', Black:'linear-gradient(135deg,#02040a,#151823 65%,#475569)', Orange:'linear-gradient(135deg,#221006,#c45c21 55%,#ffd6a6)', Pink:'linear-gradient(135deg,#220817,#be477f 55%,#ffd4e5)', Gray:'linear-gradient(135deg,#0b1220,#536174 55%,#d9e1ec)' };

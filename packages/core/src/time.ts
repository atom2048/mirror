import type { TimeSlot } from './types';
export function getDateKey(date = new Date()): string { const y = date.getFullYear(); const m = String(date.getMonth()+1).padStart(2,'0'); const d = String(date.getDate()).padStart(2,'0'); return y + '-' + m + '-' + d; }
export function getTimeSlot(date = new Date()): TimeSlot { const h = date.getHours(); if (h >= 5 && h < 11) return 'morning'; if (h >= 11 && h < 17) return 'day'; if (h >= 17 && h < 21) return 'evening'; if (h >= 21 || h < 1) return 'night'; return 'lateNight'; }
export function isNearbyDateKey(a: string, b: string, maxDays = 1): boolean { const ad = new Date(a + 'T00:00:00'); const bd = new Date(b + 'T00:00:00'); return Math.abs(ad.getTime() - bd.getTime()) <= maxDays * 86400000; }

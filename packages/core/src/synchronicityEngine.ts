import { COLOR_GRADIENTS } from './constants';
import { colorCopy } from './color';
import { isNearbyDateKey } from './time';
import type { MatchResult, MirrorCard, Pulse, PulseColor, PulseDraft, PulseSignature, Resonance } from './types';

const STOP_WORDS = new Set(['の','に','は','を','が','と','で','も','だけ','から','まで','より','the','a','an','and','or','to','of','in','on','is','am','are','i','me','my','you']);

export function normalizeWord(input: string): string[] {
  const normalized = input
    .toLowerCase()
    .replace(/[、。,.!?！？;:()[\]{}<>「」『』"'`~@#$%^&*_+=|\\/-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!normalized) return [];

  const rough = normalized.split(' ');
  const ja = normalized.split('').filter((char) => char.charCodeAt(0) > 127 && !STOP_WORDS.has(char));

  return Array.from(
    new Set([...rough, ...ja].map((token) => token.trim()).filter((token) => token.length > 0 && !STOP_WORDS.has(token)).slice(0, 12)),
  );
}

export function buildPulseSignature(input: Pick<PulseDraft, 'dateKey' | 'color' | 'mood' | 'timeSlot' | 'placeCategory' | 'cityBucket'>): PulseSignature {
  const signature: PulseSignature = {
    colorMoodKey: input.dateKey + '_' + input.color + '_' + input.mood,
    timeMoodKey: input.dateKey + '_' + input.timeSlot + '_' + input.mood,
    placeMoodKey: input.dateKey + '_' + input.placeCategory + '_' + input.mood,
  };
  if (input.cityBucket) signature.cityMoodKey = input.dateKey + '_' + input.cityBucket + '_' + input.mood;
  return signature;
}

export function scorePulseMatch(a: Pulse, b: Pulse, blockedUserIds: string[] = []): MatchResult {
  if (a.uid === b.uid || b.visibility === 'private' || !isNearbyDateKey(a.dateKey, b.dateKey) || blockedUserIds.includes(b.uid)) {
    return { score: 0, matched: false, strong: false, matchTypes: [], reason: 'excluded' };
  }

  let score = 0;
  const matchTypes: string[] = [];
  const add = (ok: boolean, points: number, label: string) => {
    if (ok) {
      score += points;
      matchTypes.push(label);
    }
  };

  add(a.color === b.color, 20, 'color');
  add(a.mood === b.mood, 20, 'mood');
  add(a.timeSlot === b.timeSlot, 10, 'time');
  add(a.placeCategory === b.placeCategory, 10, 'place');
  add(Boolean(a.cityBucket && a.cityBucket === b.cityBucket), 10, 'city');

  const commonTokens = a.normalizedWordTokens.filter((token) => b.normalizedWordTokens.includes(token));
  if (commonTokens.length > 0) {
    score += commonTokens.length * 15;
    matchTypes.push('word');
  }

  add(a.signature.colorMoodKey === b.signature.colorMoodKey, 20, 'colorMood');
  add(a.signature.placeMoodKey === b.signature.placeMoodKey, 10, 'placeMood');

  return { score, matched: score >= 30, strong: score >= 70, matchTypes, reason: commonTokens.slice(0, 3).join(', ') || matchTypes[0] || 'nearby' };
}

export function generateResonanceText(input: { color: PulseColor; mood: string; count: number; strongCount?: number }): Pick<Resonance, 'title' | 'body'> {
  const color = colorCopy(input.color);
  const count = Math.max(input.count, 0);
  if (count === 0) {
    return { title: 'まだ反射は遠くにある', body: '今日の' + color + 'は、まだ静かに水面を探している。記録は残った。次に誰かの夜が近づいたとき、ここに響きが戻ってくる。' };
  }
  const title = input.strongCount && input.strongCount > 0 ? '同じ' + color + 'を強く拾った人たち' : '同じ' + color + 'を拾った人たち';
  return { title, body: '今日、あなたと似た' + color + 'を選んだ人が' + count + '人いた。別々の場所で、' + input.mood + 'に近い気配が静かに残っていた。' };
}

export function generateMirrorCard(input: { uid: string; pulseId: string; resonanceId?: string; dateKey: string; color: PulseColor; mood: string; matchCount: number }): MirrorCard {
  const statsText = input.matchCount > 0 ? '今日の私は、' + input.color + 'を選んだ' + input.matchCount + '人の気配と響いた。' : '今日の私は、' + input.color + 'を静かに残した。';
  return {
    id: '',
    uid: input.uid,
    pulseId: input.pulseId,
    resonanceId: input.resonanceId,
    dateKey: input.dateKey,
    title: 'MIRROR CARD',
    copy: '世界のどこかに、今日のあなたと似た人がいる。' + input.mood + 'のままでも、ひとりではなかった。',
    color: input.color,
    gradient: COLOR_GRADIENTS[input.color],
    statsText,
    createdAt: new Date(),
  };
}

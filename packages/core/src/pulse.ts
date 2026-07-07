import { buildPulseSignature, normalizeWord } from './synchronicityEngine';
import { moderationStatusFor, sanitizePulseWord } from './moderation';
import type { Pulse, PulseDraft } from './types';
export function createPulseData(uid: string, draft: PulseDraft): Omit<Pulse, 'id'|'createdAt'|'updatedAt'> { const word = sanitizePulseWord(draft.word); return { uid, ...draft, word, normalizedWordTokens: normalizeWord(word), signature: buildPulseSignature(draft), moderation: { status: moderationStatusFor(word), reportCount: 0 } }; }

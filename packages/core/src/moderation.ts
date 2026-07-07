const NG_WORDS = ['死ね','殺す','住所','電話番号','stupid','kill yourself'];
export function containsBlockedWord(input: string): boolean { const lowered = input.toLowerCase(); return NG_WORDS.some((word) => lowered.includes(word.toLowerCase())); }
export function sanitizePulseWord(input: string): string { return input.replace(/[\r\n\t]+/g, ' ').trim().slice(0, 80); }
export function moderationStatusFor(input: string): 'clean' | 'flagged' { return containsBlockedWord(input) ? 'flagged' : 'clean'; }

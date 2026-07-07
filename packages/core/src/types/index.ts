export type PulseColor = 'Blue' | 'Red' | 'Yellow' | 'Green' | 'Purple' | 'White' | 'Black' | 'Orange' | 'Pink' | 'Gray';
export type TimeSlot = 'morning' | 'day' | 'evening' | 'night' | 'lateNight';
export type Visibility = 'private' | 'anonymousPublic';
export type ModerationStatus = 'clean' | 'flagged' | 'hidden';
export type ReportTargetType = 'pulse' | 'user' | 'resonance';
export type ReactionTargetType = 'pulse' | 'mirrorCard' | 'constellation';
export type ReactionEmoji = 'moon' | 'bubble' | 'eyes' | 'spark' | 'mirror';
export interface UserStats { pulseCount: number; resonanceCount: number; mirrorCardCount: number; activeDays: number; }
export interface MirrorUser { id: string; displayName: string; photoURL?: string; isAnonymous: boolean; createdAt: unknown; updatedAt: unknown; lastActiveAt: unknown; onboardingCompleted: boolean; homeCity?: string; blockedUserIds: string[]; mutedUserIds: string[]; stats: UserStats; }
export interface PulseSignature { colorMoodKey: string; timeMoodKey: string; placeMoodKey: string; cityMoodKey?: string; }
export interface PulseModeration { status: ModerationStatus; reportCount: number; }
export interface Pulse { id: string; uid: string; dateKey: string; timeSlot: TimeSlot; color: PulseColor; mood: string; word: string; normalizedWordTokens: string[]; placeCategory: string; cityBucket?: string; visibility: Visibility; signature: PulseSignature; moderation: PulseModeration; createdAt: unknown; updatedAt: unknown; }
export interface PulseDraft { dateKey: string; timeSlot: TimeSlot; color: PulseColor; mood: string; word: string; placeCategory: string; cityBucket?: string; visibility: Visibility; }
export interface MatchResult { score: number; matched: boolean; strong: boolean; matchTypes: string[]; reason: string; }
export interface Resonance { id: string; pulseId: string; uid: string; dateKey: string; matchedPulseIds: string[]; matchCount: number; dominantMatchTypes: string[]; score: number; title: string; body: string; createdAt: unknown; }
export interface MirrorCard { id: string; uid: string; pulseId: string; resonanceId?: string; dateKey: string; title: string; copy: string; color: string; gradient: string; statsText: string; createdAt: unknown; }
export interface Constellation { id: string; dateKey: string; timeSlot?: TimeSlot; cityBucket?: string; themeKey: string; dominantColor: PulseColor; dominantMood: string; representativeWords: string[]; participantCount: number; title: string; body: string; createdAt: unknown; }
export interface Report { id: string; reporterUid: string; targetType: ReportTargetType; targetId: string; reason: string; details?: string; createdAt: unknown; }
export interface Reaction { id: string; fromUid: string; targetType: ReactionTargetType; targetId: string; emoji: ReactionEmoji; createdAt: unknown; }

import { doc, getDoc, increment, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { getFirebaseClients } from '../client';
import type { MirrorUser } from '@mirror/core';

const emptyStats = { pulseCount: 0, resonanceCount: 0, mirrorCardCount: 0, activeDays: 0 };

type UserBaseInput = Partial<Pick<User, 'displayName' | 'photoURL' | 'isAnonymous'>>;

function compact<T extends Record<string, unknown>>(value: T): Partial<T> {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined)) as Partial<T>;
}

function userBase(uid: string, input?: UserBaseInput) {
  return compact({
    id: uid,
    displayName: input?.displayName || 'anonymous mirror',
    photoURL: input?.photoURL || undefined,
    isAnonymous: input?.isAnonymous ?? true,
    onboardingCompleted: false,
    blockedUserIds: [],
    mutedUserIds: [],
    stats: emptyStats,
  });
}

export async function upsertUser(user: User): Promise<void> {
  const clients = getFirebaseClients();
  if (!clients) throw new Error('Firebase is not configured.');
  const ref = doc(clients.db, 'users', user.uid);
  const snap = await getDoc(ref);
  const base = userBase(user.uid, user);
  if (snap.exists()) {
    await setDoc(ref, compact({ displayName: base.displayName, photoURL: base.photoURL, isAnonymous: base.isAnonymous, updatedAt: serverTimestamp(), lastActiveAt: serverTimestamp() }), { merge: true });
  } else {
    await setDoc(ref, { ...base, createdAt: serverTimestamp(), updatedAt: serverTimestamp(), lastActiveAt: serverTimestamp() });
  }
}

export async function ensureUserDocument(uid: string): Promise<void> {
  const clients = getFirebaseClients();
  if (!clients) throw new Error('Firebase is not configured.');
  const ref = doc(clients.db, 'users', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, { ...userBase(uid), createdAt: serverTimestamp(), updatedAt: serverTimestamp(), lastActiveAt: serverTimestamp() });
  }
}

export async function getUser(uid: string): Promise<MirrorUser | null> {
  const clients = getFirebaseClients();
  if (!clients) throw new Error('Firebase is not configured.');
  const snap = await getDoc(doc(clients.db, 'users', uid));
  return snap.exists() ? (snap.data() as MirrorUser) : null;
}

export async function completeOnboarding(uid: string): Promise<void> {
  const clients = getFirebaseClients();
  if (!clients) throw new Error('Firebase is not configured.');
  await ensureUserDocument(uid);
  await updateDoc(doc(clients.db, 'users', uid), { onboardingCompleted: true, updatedAt: serverTimestamp() });
}

export async function incrementUserStats(uid: string, key: keyof MirrorUser['stats'], amount = 1): Promise<void> {
  const clients = getFirebaseClients();
  if (!clients) throw new Error('Firebase is not configured.');
  await ensureUserDocument(uid);
  await updateDoc(doc(clients.db, 'users', uid), { ['stats.' + key]: increment(amount), updatedAt: serverTimestamp(), lastActiveAt: serverTimestamp() });
}

export async function blockUser(uid: string, targetUid: string): Promise<void> {
  const clients = getFirebaseClients();
  if (!clients) throw new Error('Firebase is not configured.');
  await ensureUserDocument(uid);
  const user = await getUser(uid);
  const next = Array.from(new Set([...(user?.blockedUserIds || []), targetUid]));
  await updateDoc(doc(clients.db, 'users', uid), { blockedUserIds: next, updatedAt: serverTimestamp() });
}

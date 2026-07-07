import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, limit, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { createPulseData, type Pulse, type PulseDraft } from '@mirror/core';
import { getFirebaseClients } from '../client';
import { incrementUserStats } from './users';

function timestampMillis(value: unknown): number {
  if (value && typeof value === 'object' && 'toMillis' in value && typeof (value as { toMillis: () => number }).toMillis === 'function') return (value as { toMillis: () => number }).toMillis();
  if (value instanceof Date) return value.getTime();
  return 0;
}

export async function createPulse(uid: string, draft: PulseDraft): Promise<Pulse> {
  const clients = getFirebaseClients();
  if (!clients) throw new Error('Firebase is not configured.');
  const data = createPulseData(uid, draft);
  const ref = await addDoc(collection(clients.db, 'pulses'), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  await updateDoc(ref, { id: ref.id });
  await incrementUserStats(uid, 'pulseCount', 1);
  return { ...data, id: ref.id, createdAt: new Date(), updatedAt: new Date() };
}

export async function getPulse(id: string): Promise<Pulse | null> {
  const clients = getFirebaseClients();
  if (!clients) throw new Error('Firebase is not configured.');
  const snap = await getDoc(doc(clients.db, 'pulses', id));
  return snap.exists() ? (snap.data() as Pulse) : null;
}

export async function listUserPulses(uid: string, max = 20): Promise<Pulse[]> {
  const clients = getFirebaseClients();
  if (!clients) throw new Error('Firebase is not configured.');
  const q = query(collection(clients.db, 'pulses'), where('uid', '==', uid), limit(Math.max(max, 30)));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Pulse).sort((a, b) => timestampMillis(b.createdAt) - timestampMillis(a.createdAt)).slice(0, max);
}

export async function findCandidatePulses(input: Pick<Pulse, 'dateKey'|'visibility'|'mood'|'timeSlot'|'placeCategory'>, max = 40): Promise<Pulse[]> {
  const clients = getFirebaseClients();
  if (!clients) throw new Error('Firebase is not configured.');
  const q = query(collection(clients.db, 'pulses'), where('visibility', '==', 'anonymousPublic'), limit(Math.max(max, 80)));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => d.data() as Pulse)
    .filter((pulse) => pulse.dateKey === input.dateKey && (pulse.mood === input.mood || pulse.timeSlot === input.timeSlot || pulse.placeCategory === input.placeCategory))
    .slice(0, max);
}

export async function makePulsePrivate(id: string): Promise<void> {
  const clients = getFirebaseClients();
  if (!clients) throw new Error('Firebase is not configured.');
  await updateDoc(doc(clients.db, 'pulses', id), { visibility: 'private', updatedAt: serverTimestamp() });
}

export async function updatePulseWord(id: string, word: string): Promise<void> {
  const clients = getFirebaseClients();
  if (!clients) throw new Error('Firebase is not configured.');
  await updateDoc(doc(clients.db, 'pulses', id), { word, updatedAt: serverTimestamp() });
}

export async function deletePulse(id: string): Promise<void> {
  const clients = getFirebaseClients();
  if (!clients) throw new Error('Firebase is not configured.');
  await deleteDoc(doc(clients.db, 'pulses', id));
}

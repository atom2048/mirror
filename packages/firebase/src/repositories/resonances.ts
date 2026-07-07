import { addDoc, collection, doc, getDoc, getDocs, limit, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import type { Resonance } from '@mirror/core';
import { getFirebaseClients } from '../client';
import { incrementUserStats } from './users';

function timestampMillis(value: unknown): number {
  if (value && typeof value === 'object' && 'toMillis' in value && typeof (value as { toMillis: () => number }).toMillis === 'function') return (value as { toMillis: () => number }).toMillis();
  if (value instanceof Date) return value.getTime();
  return 0;
}

export async function createResonance(data: Omit<Resonance, 'id'|'createdAt'>): Promise<Resonance> {
  const clients = getFirebaseClients();
  if (!clients) throw new Error('Firebase is not configured.');
  const ref = await addDoc(collection(clients.db, 'resonances'), { ...data, createdAt: serverTimestamp() });
  await updateDoc(ref, { id: ref.id });
  await incrementUserStats(data.uid, 'resonanceCount', 1);
  return { ...data, id: ref.id, createdAt: new Date() };
}

export async function getResonance(id: string): Promise<Resonance | null> {
  const clients = getFirebaseClients();
  if (!clients) throw new Error('Firebase is not configured.');
  const snap = await getDoc(doc(clients.db, 'resonances', id));
  return snap.exists() ? (snap.data() as Resonance) : null;
}

export async function listUserResonances(uid: string, max = 10): Promise<Resonance[]> {
  const clients = getFirebaseClients();
  if (!clients) throw new Error('Firebase is not configured.');
  const q = query(collection(clients.db, 'resonances'), where('uid', '==', uid), limit(Math.max(max, 20)));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Resonance).sort((a, b) => timestampMillis(b.createdAt) - timestampMillis(a.createdAt)).slice(0, max);
}

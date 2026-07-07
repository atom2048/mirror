import { addDoc, collection, doc, getDoc, getDocs, limit, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import type { MirrorCard } from '@mirror/core';
import { getFirebaseClients } from '../client';
import { incrementUserStats } from './users';

function timestampMillis(value: unknown): number {
  if (value && typeof value === 'object' && 'toMillis' in value && typeof (value as { toMillis: () => number }).toMillis === 'function') return (value as { toMillis: () => number }).toMillis();
  if (value instanceof Date) return value.getTime();
  return 0;
}

export async function createMirrorCard(data: Omit<MirrorCard, 'id'|'createdAt'>): Promise<MirrorCard> {
  const clients = getFirebaseClients();
  if (!clients) throw new Error('Firebase is not configured.');
  const ref = await addDoc(collection(clients.db, 'mirrorCards'), { ...data, createdAt: serverTimestamp() });
  await updateDoc(ref, { id: ref.id });
  await incrementUserStats(data.uid, 'mirrorCardCount', 1);
  return { ...data, id: ref.id, createdAt: new Date() };
}

export async function getMirrorCard(id: string): Promise<MirrorCard | null> {
  const clients = getFirebaseClients();
  if (!clients) throw new Error('Firebase is not configured.');
  const snap = await getDoc(doc(clients.db, 'mirrorCards', id));
  return snap.exists() ? (snap.data() as MirrorCard) : null;
}

export async function listUserMirrorCards(uid: string, max = 10): Promise<MirrorCard[]> {
  const clients = getFirebaseClients();
  if (!clients) throw new Error('Firebase is not configured.');
  const q = query(collection(clients.db, 'mirrorCards'), where('uid', '==', uid), limit(Math.max(max, 20)));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as MirrorCard).sort((a, b) => timestampMillis(b.createdAt) - timestampMillis(a.createdAt)).slice(0, max);
}

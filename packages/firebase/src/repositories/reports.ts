import { addDoc, collection, serverTimestamp, updateDoc } from 'firebase/firestore';
import type { ReportTargetType } from '@mirror/core';
import { getFirebaseClients } from '../client';
export async function createReport(input: { reporterUid: string; targetType: ReportTargetType; targetId: string; reason: string; details?: string }): Promise<string> { const clients = getFirebaseClients(); if (!clients) throw new Error('Firebase is not configured.'); const ref = await addDoc(collection(clients.db, 'reports'), { ...input, createdAt: serverTimestamp() }); await updateDoc(ref, { id: ref.id }); return ref.id; }

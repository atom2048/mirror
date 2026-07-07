import { addDoc, collection, serverTimestamp, updateDoc } from 'firebase/firestore';
import type { ReactionEmoji, ReactionTargetType } from '@mirror/core';
import { getFirebaseClients } from '../client';
export async function createReaction(input: { fromUid: string; targetType: ReactionTargetType; targetId: string; emoji: ReactionEmoji }): Promise<string> { const clients = getFirebaseClients(); if (!clients) throw new Error('Firebase is not configured.'); const ref = await addDoc(collection(clients.db, 'reactions'), { ...input, createdAt: serverTimestamp() }); await updateDoc(ref, { id: ref.id }); return ref.id; }

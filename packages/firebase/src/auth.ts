import { GoogleAuthProvider, linkWithPopup, signInAnonymously, signInWithPopup, signOut, updateProfile, type User } from 'firebase/auth';
import { getFirebaseClients } from './client';
import { upsertUser } from './repositories/users';

export async function signInAnonymous(): Promise<User> {
  const clients = getFirebaseClients();
  if (!clients) throw new Error('Firebase is not configured.');
  const credential = await signInAnonymously(clients.auth);
  await upsertUser(credential.user);
  return credential.user;
}

export async function signInWithGoogle(): Promise<User> {
  const clients = getFirebaseClients();
  if (!clients) throw new Error('Firebase is not configured.');
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const current = clients.auth.currentUser;
  const credential = current?.isAnonymous ? await linkWithPopup(current, provider) : await signInWithPopup(clients.auth, provider);
  if (credential.user.displayName) await updateProfile(credential.user, { displayName: credential.user.displayName });
  await upsertUser(credential.user);
  return credential.user;
}

export async function logout(): Promise<void> {
  const clients = getFirebaseClients();
  if (clients) await signOut(clients.auth);
}

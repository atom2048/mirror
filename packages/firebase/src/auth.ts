import { GoogleAuthProvider, getRedirectResult, linkWithPopup, linkWithRedirect, signInAnonymously, signInWithPopup, signInWithRedirect, signOut, updateProfile, type User, type UserCredential } from 'firebase/auth';
import { getFirebaseClients } from './client';
import { upsertUser } from './repositories/users';

function isPopupBlocked(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && (error as { code?: string }).code === 'auth/popup-blocked';
}

async function persistCredential(credential: UserCredential): Promise<User> {
  if (credential.user.displayName) await updateProfile(credential.user, { displayName: credential.user.displayName });
  await upsertUser(credential.user);
  return credential.user;
}

export async function signInAnonymous(): Promise<User> {
  const clients = getFirebaseClients();
  if (!clients) throw new Error('Firebase is not configured.');
  const credential = await signInAnonymously(clients.auth);
  await upsertUser(credential.user);
  return credential.user;
}

export async function signInWithGoogle(): Promise<User | null> {
  const clients = getFirebaseClients();
  if (!clients) throw new Error('Firebase is not configured.');
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const current = clients.auth.currentUser;
  try {
    const credential = current?.isAnonymous ? await linkWithPopup(current, provider) : await signInWithPopup(clients.auth, provider);
    return await persistCredential(credential);
  } catch (error) {
    if (!isPopupBlocked(error)) throw error;
    if (current?.isAnonymous) await linkWithRedirect(current, provider);
    else await signInWithRedirect(clients.auth, provider);
    return null;
  }
}

export async function completeGoogleRedirectSignIn(): Promise<User | null> {
  const clients = getFirebaseClients();
  if (!clients) throw new Error('Firebase is not configured.');
  const credential = await getRedirectResult(clients.auth);
  return credential ? persistCredential(credential) : null;
}

export async function logout(): Promise<void> {
  const clients = getFirebaseClients();
  if (clients) await signOut(clients.auth);
}

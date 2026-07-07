'use client';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { useEffect, useMemo, useState } from 'react';
import { getFirebaseClients, hasFirebaseConfig, upsertUser } from '@mirror/firebase';

export function useFirebaseUser() {
  const configured = useMemo(() => hasFirebaseConfig(), []);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(configured);

  useEffect(() => {
    if (!configured) return;
    const clients = getFirebaseClients();
    if (!clients) return;
    return onAuthStateChanged(clients.auth, async (next) => {
      setUser(next);
      if (next) await upsertUser(next);
      setLoading(false);
    });
  }, [configured]);

  return { user, loading, configured };
}

import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { type Auth } from 'firebase/auth';
import { initializeFirebaseApp } from '../services/firebase';

export const useFirebase = () => {
  const [db, setDb] = useState<Firestore | null>(null);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [appId, setAppId] = useState<string>('');
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      const { db, auth, appId } = await initializeFirebaseApp();
      
      if (!auth) {
        setIsAuthReady(true);
        setUserId(crypto.randomUUID());
        return;
      }

      setDb(db);
      setAuth(auth);
      setAppId(appId);

      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setUserId(user.uid);
        } else {
          setUserId(crypto.randomUUID());
        }
        setIsAuthReady(true);
      });

      return () => unsubscribe();
    };

    initialize();
  }, []);

  return { db, auth, userId, appId, isAuthReady };
};
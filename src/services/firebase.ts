import { initializeApp, type FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  signInWithCustomToken, 
  type Auth 
} from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Global variables from Canvas environment
const appId = typeof (window as any).__app_id !== 'undefined' 
  ? (window as any).__app_id 
  : 'default-app-id';

const firebaseConfig = typeof (window as any).__firebase_config !== 'undefined' 
  ? JSON.parse((window as any).__firebase_config) 
  : {};

const initialAuthToken = typeof (window as any).__initial_auth_token !== 'undefined' 
  ? (window as any).__initial_auth_token 
  : null;

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

export const initializeFirebaseApp = async () => {
  if (Object.keys(firebaseConfig).length === 0) {
    console.error("Firebase config is missing.");
    return { app: null, db: null, auth: null, appId };
  }

  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);

    // Authenticate
    if (initialAuthToken) {
      await signInWithCustomToken(auth, initialAuthToken);
    } else {
      await signInAnonymously(auth);
    }

    return { app, db, auth, appId };
  } catch (error) {
    console.error("Firebase initialization failed:", error);
    return { app: null, db: null, auth: null, appId };
  }
};

export const getAppId = () => appId;
export const getFirebaseDb = () => db;
export const getFirebaseAuth = () => auth;
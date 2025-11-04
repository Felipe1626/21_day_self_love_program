import { initializeApp, type FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  signInWithCustomToken, 
  type Auth 
} from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Extend the Window interface to include custom properties
declare global {
  interface Window {
    __app_id?: string;
    __firebase_config?: string;
    __initial_auth_token?: string;
  }
}

// Global variables from Canvas environment
const appId = typeof window.__app_id !== 'undefined' 
  ? window.__app_id 
  : 'default-app-id';

const firebaseConfig = {
    apiKey: "AIzaSyBVudeIGPGEz-AMvWnbDZ16Hwru63mx1ok",
    authDomain: "programa-21-dias.firebaseapp.com",
    databaseURL: "https://programa-21-dias-default-rtdb.firebaseio.com",
    projectId: "programa-21-dias",
    storageBucket: "programa-21-dias.firebasestorage.app",
    messagingSenderId: "685743291261",
    appId: "1:685743291261:web:13ee6cff1bce8ccd782a14"
};

const initialAuthToken = typeof window.__initial_auth_token !== 'undefined' 
  ? window.__initial_auth_token 
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
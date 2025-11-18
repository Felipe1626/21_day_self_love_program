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

// Try to get config from window (Claude Canvas environment) or environment variables
const getFirebaseConfig = () => {
  // First, try to get from window object (Claude Canvas)
  if (typeof window.__firebase_config !== 'undefined') {
    try {
      return JSON.parse(window.__firebase_config);
    } catch (error) {
      console.error('Error parsing window.__firebase_config:', error);
    }
  }
  
  // Otherwise, use environment variables
  const envConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  };

  // Validate that we have all required fields
  const hasAllFields = Object.values(envConfig).every(value => value !== undefined && value !== '');
  
  if (!hasAllFields) {
    console.error('Firebase configuration is incomplete. Please check your .env file.');
    return {};
  }

  return envConfig;
};

// Global variables from Canvas environment or config
const appId = typeof window.__app_id !== 'undefined' 
  ? window.__app_id 
  : 'default-app-id';

const firebaseConfig = getFirebaseConfig();

const initialAuthToken = typeof window.__initial_auth_token !== 'undefined' 
  ? window.__initial_auth_token 
  : null;

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

export const initializeFirebaseApp = async () => {
  // Check if config is valid
  if (Object.keys(firebaseConfig).length === 0) {
    console.error("Firebase config is missing. Please set up your .env file with Firebase credentials.");
    return { app: null, db: null, auth: null, appId };
  }

  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);

    console.log('Firebase initialized successfully');

    // Authenticate
    if (initialAuthToken) {
      console.log('Signing in with custom token...');
      await signInWithCustomToken(auth, initialAuthToken);
    } else {
      console.log('Signing in anonymously...');
      await signInAnonymously(auth);
    }

    console.log('Authentication successful');

    return { app, db, auth, appId };
  } catch (error) {
    console.error("Firebase initialization failed:", error);
    return { app: null, db: null, auth: null, appId };
  }
};

export const getAppId = () => appId;
export const getFirebaseDb = () => db;
export const getFirebaseAuth = () => auth;
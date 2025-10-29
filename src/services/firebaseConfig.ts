import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import type { Auth } from 'firebase/auth'; // Explicitly import Auth type
import { getFirestore } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore'; // Explicitly import Firestore type

// Hardcoded Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBVudeIGPGEz-AMvWnbDZ16Hwru63mx1ok",
    authDomain: "programa-21-dias.firebaseapp.com",
    databaseURL: "https://programa-21-dias-default-rtdb.firebaseio.com",
    projectId: "programa-21-dias",
    storageBucket: "programa-21-dias.firebasestorage.app",
    messagingSenderId: "685743291261",
    appId: "1:685743291261:web:13ee6cff1bce8ccd782a14"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Services and export with explicit TypeScript types
export const db: Firestore = getFirestore(app);
export const auth: Auth = getAuth(app);

// Export your custom appId for the Firestore path
export const CUSTOM_APP_ID: string = 'AmorPropio21Dias-web';

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

/**
 * Shared instance variables.
 */
let appInstance: FirebaseApp | null = null;
let dbInstance: Firestore | null = null;
let authInstance: Auth | null = null;

/**
 * Lazily initializes and returns the Firebase App instance.
 * Prevents build-time crashes when API keys are missing.
 */
export function getFirebaseApp(): FirebaseApp {
  if (appInstance) return appInstance;

  if (getApps().length > 0) {
    appInstance = getApp();
  } else {
    // During Next.js build, we might not have keys. 
    // We return a dummy app or handle the error gracefully at the call site.
    if (!firebaseConfig.apiKey) {
      console.warn('Firebase API key is missing. This is expected during the build phase.');
    }
    appInstance = initializeApp(firebaseConfig);
  }

  return appInstance;
}

/**
 * Lazily returns the Firestore instance.
 */
export function getDb(): Firestore {
  if (!dbInstance) {
    dbInstance = getFirestore(getFirebaseApp());
  }
  return dbInstance;
}

/**
 * Lazily returns the Firebase Auth instance.
 */
export function getFirebaseAuth(): Auth {
  if (!authInstance) {
    authInstance = getAuth(getFirebaseApp());
  }
  return authInstance;
}

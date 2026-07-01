import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyAk0T4juVljIGKK7adn608WBQvDOcFiX7U',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'farmdirect-81aa9.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'farmdirect-81aa9',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'farmdirect-81aa9.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '653957219406',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:653957219406:web:97ea052a63ca3329b26f1f',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-SE42PFDXL0',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;

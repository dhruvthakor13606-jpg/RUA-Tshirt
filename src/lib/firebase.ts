import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Log warning if config is missing
if (!import.meta.env.VITE_FIREBASE_API_KEY) {
  console.warn("⚠️ Firebase API Key is missing. Check your Vercel Environment Variables!");
}

let app: any;
try {
  if (import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_API_KEY !== "undefined") {
    app = initializeApp(firebaseConfig);
  } else {
    console.warn("⚠️ Firebase API Key is missing. The app will run in 'Mock Mode' (no database/auth). Please add VITE_FIREBASE_API_KEY to Vercel Environment Variables.");
  }
} catch (error) {
  console.error("❌ Firebase initialization failed:", error);
}

// Resilient exports - Return real service or a "safe mock" to prevent crashes
export const db = (app && app.options) ? getFirestore(app) : ({
  collection: () => ({ doc: () => ({ onSnapshot: () => () => {} }) }),
  doc: () => ({ onSnapshot: () => () => {} })
} as any);

export const auth = (app && app.options) ? getAuth(app) : ({
  onAuthStateChanged: (cb: any) => { cb(null); return () => {}; },
  currentUser: null
} as any);

export const storage = (app && app.options) ? getStorage(app) : ({} as any);

// Export a flag to help pages instantly skip DB calls if not configured
export const isMock = !app;

export default app;

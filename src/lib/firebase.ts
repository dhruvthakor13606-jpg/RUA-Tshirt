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
  collection: () => ({ 
    doc: () => ({ 
      set: () => Promise.resolve(),
      onSnapshot: () => () => {} 
    }) 
  }),
  doc: () => ({ 
    set: () => Promise.resolve(),
    setDoc: () => Promise.resolve(),
    onSnapshot: () => () => {} 
  })
} as any);

export const auth = (app && app.options) ? getAuth(app) : ({
  onAuthStateChanged: (cb: any) => { 
    // Simulate being logged in as guest in mock mode
    cb({ uid: "mock-user-123", email: "guest@rua.com", displayName: "Guest Designer" }); 
    return () => {}; 
  },
  currentUser: { uid: "mock-user-123", email: "guest@rua.com", displayName: "Guest Designer" }
} as any);

export const storage = (app && app.options) ? getStorage(app) : ({} as any);

// -- Mock Firebase Logic --
export const isMock = !app;

// Simulated Authentication Functions
export const mockSignIn = async (email: string, _pass: string) => {
  console.log("Mock Mode: Signing in with", email);
  await new Promise(r => setTimeout(r, 800));
  return { user: { uid: "mock-user-123", email, displayName: email.split('@')[0] } };
};

export const mockSignUp = async (email: string, _pass: string) => {
  console.log("Mock Mode: Creating account for", email);
  await new Promise(r => setTimeout(r, 800));
  return { user: { uid: "mock-user-123", email, displayName: email.split('@')[0] } };
};

export const mockSignOut = async () => {
  console.log("Mock Mode: Signing out");
  return Promise.resolve();
};

export default app;

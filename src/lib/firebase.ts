
import * as firebaseApp from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Check if configuration is valid
export const isFirebaseEnabled = 
    typeof window !== 'undefined' && 
    !!firebaseConfig.apiKey && 
    !!firebaseConfig.projectId;

// Initialize Firebase
// Cast to any to bypass potential type definition mismatches where named exports are not recognized
const appLib = firebaseApp as any;
const app = appLib.getApps && appLib.getApps().length > 0 
    ? appLib.getApps()[0] 
    : appLib.initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);

// Enable offline persistence
if (typeof window !== 'undefined' && isFirebaseEnabled) {
    try {
        enableIndexedDbPersistence(db).catch((err) => {
            if (err.code == 'failed-precondition') {
                // Multiple tabs open, persistence can only be enabled in one tab at a a time.
                console.log('Firebase persistence failed: Multiple tabs open');
            } else if (err.code == 'unimplemented') {
                // The current browser does not support all of the features required to enable persistence
                console.log('Firebase persistence not supported');
            }
        });
    } catch(e) {
        // console.log("Persistence error or already enabled", e);
    }
}

export { db, storage };

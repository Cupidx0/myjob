import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import{getAuth} from 'firebase/auth';
// Values come from .env (see .env.example)
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    const msg = "Missing Firebase config: copy .env.example to .env and fill in the VITE_FIREBASE_* values.";
    // This throws before React mounts, so show it on the page instead of a blank screen
    document.getElementById('root').innerHTML =
        `<p style="color:#f87171;font-family:sans-serif;padding:2rem">${msg}</p>`;
    throw new Error(msg);
}
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export{db};
const auth = getAuth(app);
export{auth};

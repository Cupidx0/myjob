const apiKey = import.meta.env.VITE_APP_KEY;
const appId = import.meta.env.VITE_APP_ID;
import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import{getAuth} from 'firebase/auth';
const firebaseConfig = {
    apiKey:`${apiKey}`,
    authDomain: "my-app-9500a.firebaseapp.com",
    projectId: "my-app-9500a",
    storageBucket: "my-app-9500a.appspot.com",
    messagingSenderId: "91957837937",
    appId:`${appId}`,
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export{db};
const auth = getAuth(app);
export{auth};

import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import{getAuth} from 'firebase/auth';
const firebaseConfig = {
    apiKey:"AIzaSyBpKs7mIyL4SMMfuWVUpt2CoWSvX3DSkFk",
    authDomain: "my-app-9500a.firebaseapp.com",
    projectId: "my-app-9500a",
    storageBucket: "my-app-9500a.appspot.com",
    messagingSenderId: "91957837937",
    appId:"1:91957837937:web:9a8a6596b95900a75edbd0",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export{db};
const auth = getAuth(app);
export{auth};

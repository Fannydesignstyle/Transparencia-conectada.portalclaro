import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC43KDwhtAAA1b-o64aPsT0YVhBJ7wan9M",
  authDomain: "transparencia-conectada.firebaseapp.com",
  projectId: "transparencia-conectada-web",
  storageBucket: "transparencia-conectada.appspot.com",
  messagingSenderId: "909306630198",
  appId: "1:123456789012:web:abcdef1234567890"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };

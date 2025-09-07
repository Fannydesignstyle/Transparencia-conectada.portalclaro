import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "transparencia-conectada.firebaseapp.com",
  projectId: "transparencia-conectada",
  storageBucket: "transparencia-conectada.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };

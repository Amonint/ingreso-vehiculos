import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAYat3UCoDlPspPVqAyiS68UpCnmOGuNZU",
  authDomain: "gomotors-web.firebaseapp.com",
  projectId: "gomotors-web",
  storageBucket: "gomotors-web.firebasestorage.app",
  messagingSenderId: "548773429995",
  appId: "1:548773429995:web:004f3736f3f1799804f4ae"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app); 
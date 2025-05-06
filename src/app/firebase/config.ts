import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAGi-8e7vv1Qcqhkt_P5k3NbarTcNRylgQ",
  authDomain: "gomotors-5ddaf.firebaseapp.com",
  projectId: "gomotors-5ddaf",
  storageBucket: "gomotors-5ddaf.appspot.com",
  messagingSenderId: "293919313265",
  appId: "1:293919313265:web:17c8db51d42cfc2395bad0",
  measurementId: "G-N8FRP7FPVR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app; 
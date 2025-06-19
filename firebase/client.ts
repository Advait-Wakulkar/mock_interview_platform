import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBCfYCHkz3r6_2wr053JSjT8a2nq5wjAn0",
  authDomain: "inprep-ededb.firebaseapp.com",
  projectId: "inprep-ededb",
  storageBucket: "inprep-ededb.firebasestorage.app",
  messagingSenderId: "18473473556",
  appId: "1:18473473556:web:0be784883b97f5264ef901",
  measurementId: "G-SEV2KJSHTT"
};

const app = !getApps.length ? initializeApp(firebaseConfig) : getApps()

export const auth = getAuth(app);
export const db = getFirestore(app)
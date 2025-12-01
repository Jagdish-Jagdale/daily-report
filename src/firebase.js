// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBN-uf0mHiOEKjhTP-TUJWL9zrr_NAbwA8",
  authDomain: "daily-report-f5a73.firebaseapp.com",
  projectId: "daily-report-f5a73",
  storageBucket: "daily-report-f5a73.firebasestorage.app",
  messagingSenderId: "179365898755",
  appId: "1:179365898755:web:1eb6c29e2f2f8505f87c36"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;

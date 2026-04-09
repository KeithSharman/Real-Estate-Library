import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDGC7yx4jUSVX0GFiZCB4-nT0JRSwkVssY",
  authDomain: "real-estate-library-4e23a.firebaseapp.com",
  projectId: "real-estate-library-4e23a",
  storageBucket: "real-estate-library-4e23a.firebasestorage.app",
  messagingSenderId: "877056318481",
  appId: "1:877056318481:web:9251b880ace608b55325b0",
  measurementId: "G-43ZML6H4WT"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
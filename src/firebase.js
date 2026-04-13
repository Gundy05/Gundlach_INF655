import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCRWsIxgtE8fRBBmg1EI3k7_XvXc0yMhJw",
  authDomain: "front-end-2-f88b3.firebaseapp.com",
  projectId: "front-end-2-f88b3",
  storageBucket: "front-end-2-f88b3.firebasestorage.app",
  messagingSenderId: "242377148940",
  appId: "1:242377148940:web:6f14da59ff087ff0f57c29"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services for use in your app
export const auth = getAuth(app);
export const db = getFirestore(app);

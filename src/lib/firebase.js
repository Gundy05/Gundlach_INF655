import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAxZO4uD88GKdtfuZD9iUe0_jfM1u3wHn4",
  authDomain: "pocket-guard-ef794.firebaseapp.com",
  projectId: "pocket-guard-ef794",
  storageBucket: "pocket-guard-ef794.firebasestorage.app",
  messagingSenderId: "527643491951",
  appId: "1:527643491951:web:4cfa925695650842d5d79a",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../lib/firebase";

function normalizeUser(user) {
  return {
    id: user.uid,
    email: user.email,
    displayName: user.displayName || "",
  };
}

export function observeAuth(callback) {
  return onAuthStateChanged(auth, (user) => {
    callback(user ? normalizeUser(user) : null);
  });
}

export async function registerUser({ name, email, password }) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);

  if (name.trim()) {
    await updateProfile(credential.user, {
      displayName: name.trim(),
    });
  }

  return normalizeUser({
    ...credential.user,
    displayName: name.trim() || credential.user.displayName,
  });
}

export async function loginUser({ email, password }) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return normalizeUser(credential.user);
}

export async function logoutUser() {
  await signOut(auth);
}

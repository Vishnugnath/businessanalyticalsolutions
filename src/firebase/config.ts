import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBvYphVqHZpCxC9JoJbcWN8fNeI4o-sanE",
  authDomain: "space-samagra.firebaseapp.com",
  projectId: "space-samagra",
  storageBucket: "space-samagra.firebasestorage.app",
  messagingSenderId: "811950253257",
  appId: "1:811950253257:web:bfe4a976e8ea025b8ad918",
  measurementId: "G-1WW7C10T7J",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.error("Firebase persistence setup failed:", err);
});

export const db = getFirestore(app);
export default app;


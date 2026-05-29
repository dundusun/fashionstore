import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC9rv4MD11QeFBjDJCqmZJRVWvAtkc1lmc",
  authDomain: "fashionstore-135a1.firebaseapp.com",
  projectId: "fashionstore-135a1",
  storageBucket: "fashionstore-135a1.firebasestorage.app",
  messagingSenderId: "931199859611",
  appId: "1:931199859611:web:1ecf2cd9a2bb2e9051bf3e"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);

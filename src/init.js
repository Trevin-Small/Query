import { initializeApp } from 'firebase/app';
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA3BKwSRjYtq48zpbWC2XmgBRRbeEp0uK4",
  authDomain: "worandle.firebaseapp.com",
  projectId: "worandle",
  storageBucket: "worandle.appspot.com",
  messagingSenderId: "572990137447",
  appId: "1:572990137447:web:81020c199600deaafce0c2",
  measurementId: "G-588PZK0BHC"
};

// Firebase initialization
const app = initializeApp(firebaseConfig);
// <-------------------------------------------------------------------------------------->

// Initialize Realtime Database and get a reference to the service
export const db = getDatabase(app);

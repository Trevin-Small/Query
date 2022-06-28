import { initializeApp } from 'firebase/app';
import { getFirestore, collection } from 'firebase/firestore';

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

// Firestore collection names
export const daily_word = 'daily-word';
export const guess_statistics = 'statistics';

// Firestore db & collections
export const db = getFirestore(app);
export const word_collection = collection(db, daily_word);
export const statistics_collection = collection(db, guess_statistics);
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
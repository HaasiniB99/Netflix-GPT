// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCVGloMQhtT62QoWrUkhG3sXPBvhow-U3o",
  authDomain: "netflixgpt-c950d.firebaseapp.com",
  projectId: "netflixgpt-c950d",
  storageBucket: "netflixgpt-c950d.firebasestorage.app",
  messagingSenderId: "416627967961",
  appId: "1:416627967961:web:8280fb19987e5a99f77bc8",
  measurementId: "G-LS9KDBYRNT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth();
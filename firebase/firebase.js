// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAZ-Z3ez7CrRA1ckjqN6jeK5cBqe34adoM",
  authDomain: "grading-df487.firebaseapp.com",
  projectId: "grading-df487",
  storageBucket: "grading-df487.appspot.com",
  messagingSenderId: "728124995823",
  appId: "1:728124995823:web:bb25641b2a061d40b9c31a",
  measurementId: "G-Y86LRDR9BX"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore();
export const storage = getStorage();
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore, collection } from 'firebase/firestore'
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJDRYPuD5Z7z_2OJZ8JwUWJ_fmNqU3alw",
  authDomain: "filmyverse-326e8.firebaseapp.com",
  projectId: "filmyverse-326e8",
  storageBucket: "filmyverse-326e8.appspot.com",
  messagingSenderId: "320735102304",
  appId: "1:320735102304:web:56cb964f1f2140a38b4a05"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const movieRef = collection(db, "movies");
export const reviewsRef = collection(db, "reviews");
export const usersRef = collection(db, "users");

export default app;
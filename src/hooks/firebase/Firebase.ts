// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCKFQWKdtGeqU_63zbFKgRtzpaJ6EAToN8",
  authDomain: "video-meet-app-ac0be.firebaseapp.com",
  projectId: "video-meet-app-ac0be",
  storageBucket: "video-meet-app-ac0be.firebasestorage.app",
  messagingSenderId: "635297564128",
  appId: "1:635297564128:web:0d2342e1181c7e327b9785",
  measurementId: "G-8WMKTDK5T2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
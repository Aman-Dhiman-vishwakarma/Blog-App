// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-b0900.firebaseapp.com",
  projectId: "mern-blog-b0900",
  storageBucket: "mern-blog-b0900.appspot.com",
  messagingSenderId: "561164364345",
  appId: "1:561164364345:web:c75b1b518e059c753c7be8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
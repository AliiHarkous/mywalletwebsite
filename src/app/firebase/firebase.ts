import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyBUf-58dnhfJ2GyEkrFHJjYF31-ZOboNKE",
  authDomain: "mywallet-64ac2.firebaseapp.com",
  projectId: "mywallet-64ac2",
  storageBucket: "mywallet-64ac2.appspot.com",
  messagingSenderId: "465599605531",
  appId: "1:465599605531:web:745b5aab4bc2cb7f3c81be",
  measurementId: "G-WP6KPYEV1N",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

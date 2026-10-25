// Import the functions you need from the SDKs you need
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDPd5F0pS8scVBM7tKkAMNE7EhS1-Nt8G0",
  authDomain: "projeto-c74a3.firebaseapp.com",
  projectId: "projeto-c74a3",
  storageBucket: "projeto-c74a3.firebasestorage.app",
  messagingSenderId: "342019872473",
  appId: "1:342019872473:web:2f6bcb01a94502e54c50c8",
  measurementId: "G-199PXERG02",
  databaseURL: 'https://projeto-c74a3-default-rtdb.firebaseio.com/'
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

export const auth = initializeAuth(app, {persistence: getReactNativePersistence(AsyncStorage),});

export const db = getFirestore(app);
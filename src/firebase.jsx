// Import the functions you need from the SDKs you need
// Import React
import React from "react";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Import Firestore SDK
import { getAuth } from "firebase/auth"; // Import Auth SDK

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC6UYGjaam-O8VtU9FEpOnzW3GQonAOZCY",
  authDomain: "restaurant-erp-43759.firebaseapp.com",
  projectId: "restaurant-erp-43759",
  storageBucket: "restaurant-erp-43759.firebasestorage.app",
  messagingSenderId: "972791453393",
  appId: "1:972791453393:web:f0fbf6410f9e4563a297f0",
  measurementId: "G-XP5MKL0K9F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);


// Create global 
const FirebaseContext = React.createContext(null);

export const FirebaseProvider = ({ children }) => (
  <FirebaseContext.Provider value={{ firestore , auth }}>
    {children}
  </FirebaseContext.Provider>
);

export const useFirebase = () => {
  return React.useContext(FirebaseContext);
};
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LogBox } from 'react-native';
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyAV41x_fvfx9MrKRrWKlnBZBNkGOx8Q0Qg",
  authDomain: "sarcapp-9d8f9.firebaseapp.com",
  projectId: "sarcapp-9d8f9",
  storageBucket: "sarcapp-9d8f9.appspot.com",
  messagingSenderId: "56909173260",
  appId: "1:56909173260:web:5b788635bcdd91611a1429",
  measurementId: "G-NBEV8TH0YY"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

LogBox.ignoreLogs(['@firebase/auth'])

export const auth = initializeAuth(app, {
 //persistence: getReactNativePersistence(AsyncStorage)
})

export const db = getFirestore();
//const analytics = getAnalytics(app);
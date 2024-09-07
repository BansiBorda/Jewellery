// config/FirebaseConfig.js
import { initializeApp } from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCKHJ9X546kRwGazsOW73RWKSMerPqYpy8",
  authDomain: "ecommerce-70f03.firebaseapp.com",
  projectId: "ecommerce-70f03",
  storageBucket: "ecommerce-70f03.appspot.com",
  messagingSenderId: "698162541848",
  appId: "1:698162541848:web:59b460eb5a156cc15dda6d"
};

// Initialize Firebase
initializeApp(firebaseConfig);

// Initialize Firestore
const db = firestore();

export { db };

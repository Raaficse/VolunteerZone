// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyChdB2x6uniVcpepjz_Z3WT0NK2-Ko0K9s",
  authDomain: "volunteerzone-d32c5.firebaseapp.com",
  projectId: "volunteerzone-d32c5",
  storageBucket: "volunteerzone-d32c5.firebasestorage.app",
  messagingSenderId: "230298689379",
  appId: "1:230298689379:web:75c26c0904a17696b93d56",
  measurementId: "G-KJFWKXB47H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
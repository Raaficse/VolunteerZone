import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyChdB2x6uniVcpepjz_Z3WT0NK2-Ko0K9s",
  authDomain: "volunteerzone-d32c5.firebaseapp.com",
  projectId: "volunteerzone-d32c5",
  storageBucket: "volunteerzone-d32c5.firebasestorage.app",
  messagingSenderId: "230298689379",
  appId: "1:230298689379:web:75c26c0904a17696b93d56",
  measurementId: "G-KJFWKXB47H"
};

// Initialize Firebase only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Analytics conditionally (only in browser)
let analytics: Analytics | null = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, analytics };

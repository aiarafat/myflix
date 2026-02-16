// This file would typically contain the actual Firebase initialization code.
// For this demo, we are mocking the service layer in services/mockStore.ts 
// to ensure the application functions without requiring active API keys.

export const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "mock-api-key",
  authDomain: "myflix-demo.firebaseapp.com",
  projectId: "myflix-demo",
  storageBucket: "myflix-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

// In a real implementation:
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const db = getFirestore(app);

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAUqxvu8KHLKZJ_dP4ETRFcv2IGPFwvrnc",
  authDomain: "mrtdt-751fc.firebaseapp.com",
  projectId: "mrtdt-751fc",
  storageBucket: "mrtdt-751fc.firebasestorage.app",
  messagingSenderId: "3810499399",
  appId: "1:3810499399:web:a833a928562f2de8c80a62",
  measurementId: "G-F38Z2N5T2Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth so your Login/Signup components can use it
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

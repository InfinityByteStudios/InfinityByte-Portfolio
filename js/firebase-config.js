import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { getAnalytics, isSupported } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyBvDfTBfnA39Zr5QL6ABs-WuKbT108s6rs",
  authDomain: "infinitybyteportfolio.firebaseapp.com",
  projectId: "infinitybyteportfolio",
  storageBucket: "infinitybyteportfolio.firebasestorage.app",
  messagingSenderId: "596641776462",
  appId: "1:596641776462:web:3168a5a2a20c465418941f",
  measurementId: "G-8D2DRBQE5B"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

isSupported()
  .then((supported) => {
    if (supported) {
      getAnalytics(app);
    }
  })
  .catch(() => {
    // Ignore analytics setup errors in unsupported environments.
  });

export { app, db };

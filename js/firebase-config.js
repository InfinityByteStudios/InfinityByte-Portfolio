import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { getAnalytics, isSupported } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-analytics.js";

let firebaseStatePromise;

async function loadFirebaseConfig() {
  const response = await fetch("/.netlify/functions/firebase-config");

  if (!response.ok) {
    throw new Error("Failed to load Firebase runtime config.");
  }

  return response.json();
}

async function getFirebaseState() {
  if (!firebaseStatePromise) {
    firebaseStatePromise = loadFirebaseConfig().then((firebaseConfig) => {
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

      return { app, db };
    });
  }

  return firebaseStatePromise;
}

export async function getApp() {
  const state = await getFirebaseState();
  return state.app;
}

export async function getDb() {
  const state = await getFirebaseState();
  return state.db;
}

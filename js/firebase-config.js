import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { getAnalytics, isSupported } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-analytics.js";

let firebaseStatePromise;

async function loadFirebaseConfig() {
  if (window.location.protocol === "file:") {
    throw new Error(
      "This page is running from file://. Use your Netlify site URL (or netlify dev) so functions are available."
    );
  }

  const endpointCandidates = [
    "/.netlify/functions/firebase-config",
    "/api/firebase-config"
  ];

  let lastError = "Unknown error";

  for (const endpoint of endpointCandidates) {
    try {
      const response = await fetch(endpoint);

      if (!response.ok) {
        const details = await response.text();
        lastError = "Endpoint " + endpoint + " returned " + response.status + ": " + details;
        continue;
      }

      const config = await response.json();
      const required = [
        "apiKey",
        "authDomain",
        "projectId",
        "storageBucket",
        "messagingSenderId",
        "appId"
      ];

      const missing = required.filter((key) => !config[key]);
      if (missing.length > 0) {
        throw new Error("Firebase runtime config is missing fields: " + missing.join(", "));
      }

      return config;
    } catch (error) {
      lastError = error.message || String(error);
    }
  }

  const isLocalHost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  if (isLocalHost) {
    throw new Error(
      "Could not load Firebase runtime config from local static server. Run 'netlify dev' in this project, or open the deployed Netlify URL."
    );
  }

  throw new Error("Could not load Firebase runtime config. " + lastError);
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

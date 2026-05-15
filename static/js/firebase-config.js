import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { initializeAppCheck, ReCaptchaV3Provider } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app-check.js";

const firebaseConfig = {
  apiKey: "AIzaSyD4n1JbCGD3Bn9mrOUeWMoakMVi1Mv5ihI",
  authDomain: "molim-ab787.firebaseapp.com",
  projectId: "molim-ab787",
  storageBucket: "molim-ab787.firebasestorage.app",
  messagingSenderId: "890999739204",
  appId: "1:890999739204:web:5fb2e08f6369e96da9bd11",
  measurementId: "G-GL15KELDCF"
};

const app = initializeApp(firebaseConfig);

initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('6LdbaussAAAAAOzAiFsmvopEBmCbwXzulRwEICBN'),
  isTokenAutoRefreshEnabled: true
});

export const auth = getAuth(app);
export const db = getFirestore(app);
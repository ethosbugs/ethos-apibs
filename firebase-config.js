import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDwLTK1bT2nB215W03Ot2N6UxEsLbN36Jk",
  authDomain: "ethos-brawl-tracker.firebaseapp.com",
  projectId: "ethos-brawl-tracker",
  storageBucket: "ethos-brawl-tracker.firebasestorage.app",
  messagingSenderId: "706650010986",
  appId: "1:706650010986:web:a36704353f52b094a4e113"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
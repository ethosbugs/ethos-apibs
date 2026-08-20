import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Configuración de Firebase de ethos-brawl-tracker
const firebaseConfig = {
  apiKey: "AIzaSyDwLTK1bT2nB215W03Ot2N6UxEsLbN36Jk",
  authDomain: "ethos-brawl-tracker.firebaseapp.com",
  projectId: "ethos-brawl-tracker",
  storageBucket: "ethos-brawl-tracker.firebasestorage.app",
  messagingSenderId: "706650010986",
  appId: "1:706650010986:web:a36704353f52b094a4e113",
  measurementId: "G-1G12024961"
};

// Inicialización de Firebase y Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM ELEMENTS
const authOverlay = document.getElementById("authOverlay");
const loginName = document.getElementById("loginName");
const loginPass = document.getElementById("loginPass");
const loginBtn = document.getElementById("loginBtn");
const signupName = document.getElementById("signupName");
const signupPass = document.getElementById("signupPass");
const signupBtn = document.getElementById("signupBtn");

const tagInput = document.getElementById("tagInput");
const searchBtn = document.getElementById("searchBtn");

// ESTADO DE USUARIO
let user = JSON.parse(localStorage.getItem("brawlUser")) || null;

function checkAuth() {
  if (!user) {
    authOverlay.classList.remove("hidden");
  } else {
    authOverlay.classList.add("hidden");
    document.getElementById("profileName").textContent = user.name;
    document.getElementById("profileCount").textContent = user.evaluations || 0;
  }
}
checkAuth();

// PESTAÑAS LOGIN/SIGNUP
document.getElementById("tabLogin").addEventListener("click", () => {
  document.getElementById("loginPanel").classList.remove("hidden");
  document.getElementById("signupPanel").classList.add("hidden");
});
document.getElementById("tabSignup").addEventListener("click", () => {
  document.getElementById("signupPanel").classList.remove("hidden");
  document.getElementById("loginPanel").classList.add("hidden");
});

// REGISTRO
signupBtn.addEventListener("click", async () => {
  const name = signupName.value.trim();
  const pass = signupPass.value.trim();
  if (!name || !pass) return alert("Completa los campos");

  const ref = doc(db, "users", name);
  const snap = await getDoc(ref);
  if (snap.exists()) return alert("El usuario ya existe");

  const newUser = { password: pass, evaluations: 0 };
  await setDoc(ref, newUser);
  user = { name, evaluations: 0 };
  localStorage.setItem("brawlUser", JSON.stringify(user));
  checkAuth();
});

// LOGIN
loginBtn.addEventListener("click", async () => {
  const name = loginName.value.trim();
  const pass = loginPass.value.trim();
  const ref = doc(db, "users", name);
  const snap = await getDoc(ref);

  if (!snap.exists() || snap.data().password !== pass) {
    return alert("Credenciales incorrectas");
  }

  user = { name, evaluations: snap.data().evaluations || 0 };
  localStorage.setItem("brawlUser", JSON.stringify(user));
  checkAuth();
});

// SIMULADOR DE API DE BRAWL STARS
function getSimulatedPlayerData(tag) {
  // Genera datos aleatorios basados en la longitud del Tag escrito
  const randomFactor = tag.length;
  const trophies = Math.floor((randomFactor * 3210) % 60000) + 1200;
  const brawlersCount = Math.min(78, Math.floor(trophies / 600) + 10);
  
  return {
    name: "Brawler_" + tag.replace("#", ""),
    tag: tag.startsWith("#") ? tag : "#" + tag,
    trophies: trophies,
    brawlersCount: brawlersCount
  };
}

// EVALUAR CUENTA
searchBtn.addEventListener("click", () => {
  const tag = tagInput.value.trim();
  if (!tag) return alert("Introduce un #TAG válido");

  const playerData = getSimulatedPlayerData(tag);
  
  // Algoritmo de cálculo
  const estimatedGems = Math.floor(playerData.trophies / 15) + (playerData.brawlersCount * 50);
  const estimatedUSD = ((estimatedGems / 80) * 4.99).toFixed(2);
  
  let rank = "C";
  let roast = "Cuenta inicial. ¡Aún le falta mucho trabajo!";
  
  if (playerData.trophies > 40000) {
    rank = "S+";
    roast = "¡Cuenta legendaria! Esta cuenta vale una fortuna.";
  } else if (playerData.trophies > 20000) {
    rank = "A";
    roast = "Buena cuenta. Sólida para competir en ligas altas.";
  } else if (playerData.trophies > 8000) {
    rank = "B";
    roast = "Cuenta promedio. Vas por buen camino.";
  }

  // Actualizar UI
  document.getElementById("cardName").textContent = playerData.name;
  document.getElementById("cardTag").textContent = playerData.tag;
  document.getElementById("cardTrophies").textContent = playerData.trophies;
  document.getElementById("cardValue").textContent = `$${estimatedUSD}`;
  document.getElementById("cardRank").textContent = rank;
  document.getElementById("cardRoast").textContent = `"${roast}"`;

  // Actualizar contador
  if (user) {
    user.evaluations = (user.evaluations || 0) + 1;
    localStorage.setItem("brawlUser", JSON.stringify(user));
    document.getElementById("profileCount").textContent = user.evaluations;
  }
});

// ABRIR/CERRAR PERFIL
document.getElementById("openProfile").addEventListener("click", () => {
  document.getElementById("profilePanel").classList.toggle("hidden");
});
document.getElementById("closeProfile").addEventListener("click", () => {
  document.getElementById("profilePanel").classList.add("hidden");
});
document.getElementById("clearLocal").addEventListener("click", () => {
  localStorage.clear();
  location.reload();
});
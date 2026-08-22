import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDwLTK1bT2nB215W03Ot2N6UxEsLbN36Jk",
  authDomain: "ethos-brawl-tracker.firebaseapp.com",
  projectId: "ethos-brawl-tracker",
  storageBucket: "ethos-brawl-tracker.firebasestorage.app",
  messagingSenderId: "706650010986",
  appId: "1:706650010986:web:a36704353f52b094a4e113"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const POP_CULTURE_QUOTES = [
  "\"Con un gran poder viene una gran responsabilidad.\" — Uncle Ben",
  "\"No te compares con nadie en este mundo.\" — Bill Gates",
  "\"El único modo de hacer un gran trabajo es amar lo que haces.\" — Steve Jobs",
  "\"Caerse está permitido, levantarse es obligatorio.\" — Proverbio Japonés"
];

const MAIN_QUOTES = [
  "El éxito es la suma de pequeños esfuerzos repetidos día tras día.",
  "No cuentes los días, haz que los días cuenten.",
  "La disciplina es el puente entre tus metas y tus logros."
];

let user = null;
let habits = JSON.parse(localStorage.getItem("trackerHabits")) || [];
let history = JSON.parse(localStorage.getItem("trackerHistory")) || {};
let customCategories = JSON.parse(localStorage.getItem("trackerCategories")) || ["Salud", "Estudio", "Personal"];
let currentTheme = localStorage.getItem("trackerTheme") || "theme-default";
let activeFilter = "Todos";

document.body.className = currentTheme;
document.getElementById("themeSelect").value = currentTheme;
document.getElementById("quoteText").textContent = `"${MAIN_QUOTES[new Date().getDate() % MAIN_QUOTES.length]}"`;

function setDailyLoginQuote() {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  document.getElementById("loginQuote").textContent = POP_CULTURE_QUOTES[seed % POP_CULTURE_QUOTES.length];
}
setDailyLoginQuote();

function checkAuth() {
  if (!user) {
    document.getElementById("authOverlay").classList.remove("hidden");
  } else {
    document.getElementById("authOverlay").classList.add("hidden");
    document.getElementById("profileName").textContent = user.name;
    renderCategoryOptions();
    saveAndRender();
  }
}

document.getElementById("loginBtn").addEventListener("click", async () => {
  const name = document.getElementById("loginName").value.trim();
  const pass = document.getElementById("loginPass").value.trim();
  if (!name || !pass) return alert("Completa los campos");

  const ref = doc(db, "users", name);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    if (snap.data().password !== pass) {
      return alert("Contraseña incorrecta");
    }
  } else {
    await setDoc(ref, { password: pass });
  }

  user = { name };
  checkAuth();
});

const categorySelect = document.getElementById("categorySelect");
categorySelect.addEventListener("change", (e) => {
  if (e.target.value === "__NEW__") {
    const newCat = prompt("Introduce el nombre de la nueva categoría:");
    if (newCat && newCat.trim() !== "") {
      const formatted = newCat.trim();
      if (!customCategories.includes(formatted)) {
        customCategories.push(formatted);
        localStorage.setItem("trackerCategories", JSON.stringify(customCategories));
      }
      renderCategoryOptions();
      categorySelect.value = formatted;
    } else {
      categorySelect.value = customCategories[0] || "Personal";
    }
  }
});

function renderCategoryOptions() {
  categorySelect.innerHTML = customCategories.map(c => `<option value="${c}">${c}</option>`).join('') +
    `<option value="__NEW__">+ Nueva categoría...</option>`;

  const filtersBar = document.getElementById("filtersBar");
  filtersBar.innerHTML = `<button class="filter-btn ${activeFilter === 'Todos' ? 'active' : ''}" onclick="setFilter('Todos')">Todos</button>` +
    customCategories.map(c => `<button class="filter-btn ${activeFilter === c ? 'active' : ''}" onclick="setFilter('${c}')">${c}</button>`).join('');
}

document.getElementById("addHabitBtn").addEventListener("click", () => {
  const text = document.getElementById("habitInput").value.trim();
  const cat = categorySelect.value;
  if (!text || cat === "__NEW__") return;

  habits.push({ id: Date.now(), name: text, category: cat, completed: false });
  document.getElementById("habitInput").value = "";
  saveAndRender();
});

window.toggleHabit = (id) => {
  habits = habits.map(h => h.id === id ? { ...h, completed: !h.completed } : h);
  saveAndRender();
};

window.deleteHabit = (id) => {
  habits = habits.filter(h => h.id !== id);
  saveAndRender();
};

window.setFilter = (cat) => {
  activeFilter = cat;
  renderCategoryOptions();
  renderHabits();
};

function saveAndRender() {
  localStorage.setItem("trackerHabits", JSON.stringify(habits));
  const today = new Date().toISOString().split('T')[0];
  const total = habits.length;
  const done = habits.filter(h => h.completed).length;
  history[today] = total > 0 ? (done / total) : 0;
  localStorage.setItem("trackerHistory", JSON.stringify(history));

  renderHabits();
  renderCharts();
  calculateStreak();
}

function renderHabits() {
  const filtered = activeFilter === "Todos" ? habits : habits.filter(h => h.category === activeFilter);
  document.getElementById("habitList").innerHTML = filtered.map(h => `
    <li class="habit-item ${h.completed ? 'completed' : ''}">
      <span>[${h.category}] ${h.name}</span>
      <div>
        <button onclick="toggleHabit(${h.id})" style="padding:5px 10px; cursor:pointer;">${h.completed ? '✓' : '◯'}</button>
        <button onclick="deleteHabit(${h.id})" style="padding:5px 10px; cursor:pointer; color:red;">✕</button>
      </div>
    </li>
  `).join('');
}

function renderCharts() {
  const total = habits.length;
  const done = habits.filter(h => h.completed).length;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  document.getElementById("pieSegment").setAttribute("stroke-dasharray", `${percent} 100`);
  document.getElementById("piePercent").textContent = `${percent}%`;

  const yearGrid = document.getElementById("yearGrid");
  yearGrid.innerHTML = "";
  for (let i = 364; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayProgress = history[dateStr] || 0;

    const yDot = document.createElement("div");
    let lvl = "";
    if (dayProgress > 0.8) lvl = "lvl-3";
    else if (dayProgress > 0.4) lvl = "lvl-2";
    else if (dayProgress > 0) lvl = "lvl-1";

    yDot.className = `year-dot ${lvl}`;
    yDot.title = `${dateStr}: ${Math.round(dayProgress * 100)}%`;
    yearGrid.appendChild(yDot);
  }
}

function calculateStreak() {
  const today = new Date().toISOString().split('T')[0];
  const todayDone = history[today] && history[today] > 0;
  let streak = 0;
  let d = new Date();

  if (!todayDone) d.setDate(d.getDate() - 1);

  while (true) {
    const dateStr = d.toISOString().split('T')[0];
    if (history[dateStr] && history[dateStr] > 0) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else break;
  }

  document.getElementById("streakCount").textContent = streak;
  const goldOption = document.getElementById("goldThemeOption");
  if (streak >= 365) {
    goldOption.removeAttribute("disabled");
    goldOption.textContent = "👑 Tema Oro (Desbloqueado)";
  }
}

document.getElementById("themeSelect").addEventListener("change", (e) => {
  currentTheme = e.target.value;
  document.body.className = currentTheme;
  localStorage.setItem("trackerTheme", currentTheme);
});

document.getElementById("openProfile").addEventListener("click", () => document.getElementById("profilePanel").classList.toggle("hidden"));
document.getElementById("closeProfile").addEventListener("click", () => document.getElementById("profilePanel").classList.add("hidden"));
document.getElementById("clearLocal").addEventListener("click", () => { localStorage.clear(); location.reload(); });
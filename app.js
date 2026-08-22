import { db } from "./firebase-config.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 20 FRASES MOTIVACIONALES
const MOTIVATIONAL_QUOTES = [
  "La disciplina es la clave de la libertad personal.",
  "El éxito no se logra por suerte, sino con consistencia diaria.",
  "Haz hoy lo que otros no quieren para vivir mañana como otros no pueden.",
  "Pequeños hábitos diarios generan grandes resultados anuales.",
  "Tu único límite es la mente que te dice que no puedes.",
  "No cuentes los días, haz que los días cuenten.",
  "La constancia vence al talento cuando el talento no se esfuerza.",
  "El dolor de la disciplina es temporal; el del arrepentimiento es para siempre.",
  "Construye en silencio y deja que tu éxito haga el ruido.",
  "La motivación te pone en marcha, el hábito te mantiene creciendo.",
  "Domina tus hábitos o tus hábitos te dominarán a ti.",
  "Cada acción que ejecutas es un voto por la persona en la que te convertirás.",
  "No busques perfección, busca progreso constante.",
  "El rigor diario supera las ganas pasajeras.",
  "Si quieres resultados extraordinarios, exige un compromiso diario.",
  "Tu futuro está oculto en tu rutina diaria.",
  "Crea el hábito de vencerte a ti mismo cada mañana.",
  "El enfoque firme crea destinos increíbles.",
  "La autodisciplina es mostrarte respeto a ti mismo.",
  "Hoy es otra oportunidad para estar más cerca de tu meta."
];

let user = null;
let habits = JSON.parse(localStorage.getItem("trackerHabits_v2")) || [];
let history = JSON.parse(localStorage.getItem("trackerHistory_v2")) || {};
let customCategories = JSON.parse(localStorage.getItem("trackerCategories_v2")) || ["Salud", "Estudio", "Personal"];
let activeFilter = "Todos";

function getRandomQuote() { 
  return MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]; 
}

// Inicialización de Frases y Temas
document.getElementById("loginQuote").textContent = `"${getRandomQuote()}"`;
document.getElementById("quoteText").textContent = `"${getRandomQuote()}"`;

const savedTheme = localStorage.getItem("trackerTheme_v2") || "theme-naranja";
document.body.className = savedTheme;

window.setTheme = (themeClass) => {
  document.body.className = themeClass;
  localStorage.setItem("trackerTheme_v2", themeClass);
};

// Verificación de cambio de día y reset automático de checkboxes
function checkDailyReset() {
  const today = new Date().toISOString().split('T')[0];
  const lastOpened = localStorage.getItem("trackerLastDate_v2");

  if (lastOpened !== today) {
    habits = habits.map(h => ({ ...h, completed: false }));
    localStorage.setItem("trackerLastDate_v2", today);
    localStorage.setItem("trackerHabits_v2", JSON.stringify(habits));
  }
}

function checkAuth() {
  if (!user) {
    document.getElementById("authOverlay").classList.remove("hidden");
  } else {
    document.getElementById("authOverlay").classList.add("hidden");
    document.getElementById("profileName").textContent = user.email;
    checkDailyReset();
    renderCategoryOptions();
    saveAndRender();
  }
}

// Autenticación por correo
document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const pass = document.getElementById("loginPass").value.trim();
  if (!email || !pass) return alert("Por favor introduce correo y contraseña");

  const docId = email.replace(/[^a-zA-Z0-9]/g, "_");
  const ref = doc(db, "users", docId);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    if (snap.data().password !== pass) return alert("Contraseña incorrecta");
  } else {
    await setDoc(ref, { email: email, password: pass });
  }

  user = { email };
  checkAuth();
});

const categorySelect = document.getElementById("categorySelect");
categorySelect.addEventListener("change", (e) => {
  if (e.target.value === "__NEW__") {
    const newCat = prompt("Nueva categoría:");
    if (newCat && newCat.trim() !== "") {
      const formatted = newCat.trim();
      if (!customCategories.includes(formatted)) {
        customCategories.push(formatted);
        localStorage.setItem("trackerCategories_v2", JSON.stringify(customCategories));
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
  habits = habits.map(h => {
    if (h.id === id) {
      const nextState = !h.completed;
      if (nextState) {
        setTimeout(() => {
          const el = document.getElementById(`habit-${id}`);
          if (el) el.classList.add('just-completed');
        }, 10);
      }
      return { ...h, completed: nextState };
    }
    return h;
  });
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
  localStorage.setItem("trackerHabits_v2", JSON.stringify(habits));
  const today = new Date().toISOString().split('T')[0];
  const total = habits.length;
  const done = habits.filter(h => h.completed).length;
  history[today] = total > 0 ? (done / total) : 0;
  localStorage.setItem("trackerHistory_v2", JSON.stringify(history));

  renderHabits();
  renderCharts();
  calculateStreak();
}

function renderHabits() {
  const filtered = activeFilter === "Todos" ? habits : habits.filter(h => h.category === activeFilter);
  document.getElementById("habitList").innerHTML = filtered.map(h => `
    <li id="habit-${h.id}" class="habit-item ${h.completed ? 'completed' : ''}">
      <span>[${h.category}] ${h.name}</span>
      <div>
        <button class="btn-action ${h.completed ? 'check' : ''}" onclick="toggleHabit(${h.id})">${h.completed ? '✓' : '◯'}</button>
        <button class="btn-action delete" onclick="deleteHabit(${h.id})">✕</button>
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
    
    // Regla: Solo pasa a dorado brillante al alcanzar 100% de completado
    if (dayProgress >= 1) {
      lvl = "lvl-gold";
    } else if (dayProgress > 0.6) {
      lvl = "lvl-3";
    } else if (dayProgress > 0.3) {
      lvl = "lvl-2";
    } else if (dayProgress > 0) {
      lvl = "lvl-1";
    }

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
}

document.getElementById("openProfile").addEventListener("click", () => document.getElementById("profilePanel").classList.toggle("hidden"));
document.getElementById("closeProfile").addEventListener("click", () => document.getElementById("profilePanel").classList.add("hidden"));
document.getElementById("clearLocal").addEventListener("click", () => { localStorage.clear(); location.reload(); });
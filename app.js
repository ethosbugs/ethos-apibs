import { db } from "./firebase-config.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ==========================================================================
   DATOS ESTÁTICOS
   ========================================================================== */

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

const ALL_BADGES = [
  { id: 'streak_1', icon: '🐣', title: 'Nacimiento', desc: 'Consigue tu 1er día de racha' },
  { id: 'streak_3', icon: '🔥', title: 'Chispa', desc: 'Racha de 3 días' },
  { id: 'streak_7', icon: '⚡', title: 'Una Semana', desc: 'Racha de 7 días' },
  { id: 'streak_14', icon: '💪', title: 'Dos Semanas', desc: 'Racha de 14 días' },
  { id: 'streak_21', icon: '🧠', title: 'Hábito Formado', desc: 'Racha de 21 días' },
  { id: 'streak_30', icon: '📅', title: 'Un Mes Integro', desc: 'Racha de 30 días' },
  { id: 'streak_60', icon: '🚀', title: 'En Órbita', desc: 'Racha de 60 días' },
  { id: 'streak_100', icon: '💯', title: 'Centenario', desc: 'Racha de 100 días' },
  { id: 'streak_180', icon: '🛡️', title: 'Medio Año', desc: 'Racha de 180 días' },
  { id: 'streak_365', icon: '👑', title: 'Leyenda Anual', desc: 'Racha de 365 días' },
  { id: 'create_1', icon: '🌱', title: 'Primer Semilla', desc: 'Crea tu 1er hábito' },
  { id: 'create_3', icon: '🌿', title: 'Jardín', desc: 'Ten 3 hábitos creados' },
  { id: 'create_5', icon: '🌳', title: 'Bosque', desc: 'Ten 5 hábitos creados' },
  { id: 'create_10', icon: '🏛️', title: 'Arquitecto', desc: 'Ten 10 hábitos creados' },
  { id: 'target_1', icon: '🎯', title: 'Objetivo Cuantitativo', desc: 'Crea un hábito con meta numérica' },
  { id: 'weekdays_only', icon: '💼', title: 'Laboral', desc: 'Crea un hábito sólo de Lunes a Viernes' },
  { id: 'weekend_hero', icon: '🏖️', title: 'Fin de Semana', desc: 'Crea un hábito de Sábado/Domingo' },
  { id: 'done_1', icon: '✅', title: 'Primer Paso', desc: 'Completa 1 hábito' },
  { id: 'done_10', icon: '🥉', title: 'Iniciado', desc: 'Completa 10 hábitos acumulados' },
  { id: 'done_50', icon: '🥈', title: 'Constante', desc: 'Completa 50 hábitos acumulados' },
  { id: 'done_100', icon: '🥇', title: 'Imparable', desc: 'Completa 100 hábitos acumulados' },
  { id: 'done_250', icon: '🎖️', title: 'Veterano', desc: 'Completa 250 hábitos acumulados' },
  { id: 'done_500', icon: '💎', title: 'Maestro', desc: 'Completa 500 hábitos acumulados' },
  { id: 'done_1000', icon: '🔮', title: 'Transcendental', desc: 'Completa 1000 hábitos acumulados' },
  { id: 'full_day_1', icon: '🌟', title: 'Día Perfecto', desc: 'Completa todos tus hábitos de un día' },
  { id: 'full_day_7', icon: '🌈', title: 'Semana Perfecta', desc: 'Completa todos los hábitos 7 veces' },
  { id: 'xp_50', icon: '✨', title: 'Primeros Brillos', desc: 'Acumula 50 XP' },
  { id: 'xp_200', icon: '⭐', title: 'Estrella Naciente', desc: 'Acumula 200 XP' },
  { id: 'xp_500', icon: '🌟', title: 'Prodigio', desc: 'Acumula 500 XP' },
  { id: 'xp_1000', icon: '💫', title: 'Fuerza Imparable', desc: 'Acumula 1,000 XP' },
  { id: 'lvl_2', icon: '⬆️', title: 'Nivel 2', desc: 'Alcanza el Nivel 2' },
  { id: 'lvl_5', icon: '🛡️', title: 'Nivel 5', desc: 'Alcanza el Nivel 5' },
  { id: 'lvl_10', icon: '👑', title: 'Nivel 10', desc: 'Alcanza el Nivel 10' },
  { id: 'lvl_20', icon: '🐉', title: 'Nivel 20', desc: 'Alcanza el Nivel 20' },
  { id: 'pomo_1', icon: '⏱️', title: 'Primer Enfoque', desc: 'Completa 1 sesión Pomodoro' },
  { id: 'pomo_5', icon: '⌛', title: 'Concentrado', desc: 'Completa 5 Pomodoros' },
  { id: 'pomo_10', icon: '🧠', title: 'Deep Work', desc: 'Completa 10 Pomodoros' },
  { id: 'pomo_25', icon: '🔥', title: 'Hiper-Enfoque', desc: 'Completa 25 Pomodoros' },
  { id: 'pomo_50', icon: '🚀', title: 'Productivo', desc: 'Completa 50 Pomodoros' },
  { id: 'pomo_100', icon: '🏆', title: 'Titán del Enfoque', desc: 'Completa 100 Pomodoros' },
  { id: 'note_1', icon: '✍️', title: 'Primer Diario', desc: 'Escribe tu primera nota diaria' },
  { id: 'note_5', icon: '📖', title: 'Escribano', desc: 'Escribe notas en 5 días diferentes' },
  { id: 'note_15', icon: '📚', title: 'Biógrafo', desc: 'Escribe notas en 15 días diferentes' },
  { id: 'note_30', icon: '🖊️', title: 'Filósofo', desc: 'Escribe notas en 30 días diferentes' },
  { id: 'note_long', icon: '📜', title: 'Inspiración', desc: 'Escribe una nota de más de 100 caracteres' },
  { id: 'freeze_1', icon: '🧊', title: 'Bajo Cero', desc: 'Usa por primera vez un Congelador' },
  { id: 'cat_new', icon: '🏷️', title: 'Organizador', desc: 'Crea una categoría personalizada' },
  { id: 'theme_change', icon: '🎨', title: 'Camaleón', desc: 'Cambia el tema visual de la app' },
  { id: 'export_data', icon: '💾', title: 'Precavido', desc: 'Exporta tus datos en archivo JSON' },
  { id: 'all_badges', icon: '🌌', title: 'Omnipotente', desc: 'Desbloquea 45 o más insignias' }
];

const DAY_NAMES_FULL = { 1: "Lunes", 2: "Martes", 3: "Miércoles", 4: "Jueves", 5: "Viernes", 6: "Sábado", 0: "Domingo" };
const DAY_LABELS_SHORT = [
  { id: 1, label: "L" }, { id: 2, label: "M" }, { id: 3, label: "X" },
  { id: 4, label: "J" }, { id: 5, label: "V" }, { id: 6, label: "S" }, { id: 0, label: "D" }
];

/* ==========================================================================
   ESTADO
   ========================================================================== */

let user = null;
let habits = [];
let history = {};
let dailyNotes = {};
let userXp = 0;
let streakFrozenDate = null;
let unlockedBadges = [];
let pomosCompleted = 0;
let customCategories = ["Salud", "Estudio", "Personal"];
let activeFilter = "Todos";
let currentStreak = 0;
let wasAllCompletedToday = false;

/* ==========================================================================
   UTILIDADES
   ========================================================================== */

const $ = (id) => document.getElementById(id);
const todayStr = () => new Date().toISOString().split('T')[0];

function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

/** Debounce genérico para evitar escrituras excesivas (a Firestore, etc). */
function debounce(fn, delay) {
  let t = null;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

function showSyncIndicator(text) {
  let el = $("syncIndicator");
  if (!el) {
    el = document.createElement("div");
    el.id = "syncIndicator";
    el.className = "sync-indicator";
    document.body.appendChild(el);
  }
  el.innerHTML = `<span class="spinner"></span> ${escapeHtml(text)}`;
  el.classList.remove("hidden");
}
function hideSyncIndicator() {
  const el = $("syncIndicator");
  if (el) el.classList.add("hidden");
}

/* ==========================================================================
   SONIDO
   ========================================================================== */

let audioCtx = null;
function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playSound(type) {
  const ctx = getAudioCtx();
  if (ctx.state === 'suspended') ctx.resume();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  if (type === 'check') {
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    osc.start(); osc.stop(ctx.currentTime + 0.15);
  } else if (type === 'uncheck') {
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc.start(); osc.stop(ctx.currentTime + 0.1);
  } else if (type === 'fanfare') {
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
      g.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.08);
      g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.08 + 0.25);
      o.start(ctx.currentTime + idx * 0.08); o.stop(ctx.currentTime + idx * 0.08 + 0.25);
    });
  }
}

/* ==========================================================================
   FRASES Y TEMA
   ========================================================================== */

function getRandomQuote() { return MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]; }

$("loginQuote").textContent = `"${getRandomQuote()}"`;
$("quoteText").textContent = `"${getRandomQuote()}"`;

const savedTheme = localStorage.getItem("trackerTheme_v2") || "theme-naranja";
document.body.className = savedTheme;

function setTheme(themeClass, { fromUser = false } = {}) {
  if (themeClass === 'theme-dorado' && currentStreak < 365) {
    if (fromUser) alert("🔒 El tema Dorado requiere alcanzar una racha ininterrumpida de 365 días.");
    return;
  }
  document.body.className = themeClass;
  localStorage.setItem("trackerTheme_v2", themeClass);
  if (fromUser) {
    unlockBadge('theme_change');
    queueCloudSave();
  }
}

$("themeSelector").addEventListener("click", (e) => {
  const dot = e.target.closest("[data-theme]");
  if (dot) setTheme(dot.dataset.theme, { fromUser: true });
});

/* ==========================================================================
   SELECTOR DE DÍAS
   ========================================================================== */

function updateDaysHelperText() {
  const selectedBtns = document.querySelectorAll(".day-btn.selected");
  const helper = $("daysHelperText");
  if (selectedBtns.length === 7) {
    helper.textContent = "Hábito programado para: Todos los días de la semana.";
  } else if (selectedBtns.length === 0) {
    helper.textContent = "⚠️ Atención: Debes seleccionar al menos un día.";
  } else if (selectedBtns.length === 5 && Array.from(selectedBtns).every(b => +b.dataset.day >= 1 && +b.dataset.day <= 5)) {
    helper.textContent = "Hábito programado para: Días laborables (Lunes a Viernes).";
  } else {
    const selectedNames = Array.from(selectedBtns).map(b => DAY_NAMES_FULL[b.dataset.day]);
    helper.textContent = `Hábito programado para: ${selectedNames.join(", ")}.`;
  }
}

document.querySelectorAll(".day-btn").forEach(btn => {
  btn.addEventListener("click", () => { btn.classList.toggle("selected"); updateDaysHelperText(); });
});
$("selectDaily").addEventListener("click", () => {
  document.querySelectorAll(".day-btn").forEach(b => b.classList.add("selected"));
  updateDaysHelperText();
});
$("selectWeekdays").addEventListener("click", () => {
  document.querySelectorAll(".day-btn").forEach(b => {
    const day = +b.dataset.day;
    b.classList.toggle("selected", day >= 1 && day <= 5);
  });
  updateDaysHelperText();
});
$("clearDays").addEventListener("click", () => {
  document.querySelectorAll(".day-btn").forEach(b => b.classList.remove("selected"));
  updateDaysHelperText();
});

/* ==========================================================================
   XP / NIVEL / INSIGNIAS
   ========================================================================== */

function addXp(amount) {
  userXp = Math.max(0, userXp + amount);
  renderGamification();
}

function checkBadges() {
  const totalHabitsCount = habits.length;
  const totalCompletedCompletions = habits.reduce((acc, h) => acc + (h.streak || 0), 0);
  const level = Math.floor(userXp / 100) + 1;
  const notesDaysCount = Object.keys(dailyNotes).filter(k => dailyNotes[k] && dailyNotes[k].trim() !== '').length;
  const todayNote = dailyNotes[todayStr()] || '';

  if (currentStreak >= 1) unlockBadge('streak_1');
  if (currentStreak >= 3) unlockBadge('streak_3');
  if (currentStreak >= 7) unlockBadge('streak_7');
  if (currentStreak >= 14) unlockBadge('streak_14');
  if (currentStreak >= 21) unlockBadge('streak_21');
  if (currentStreak >= 30) unlockBadge('streak_30');
  if (currentStreak >= 60) unlockBadge('streak_60');
  if (currentStreak >= 100) unlockBadge('streak_100');
  if (currentStreak >= 180) unlockBadge('streak_180');
  if (currentStreak >= 365) unlockBadge('streak_365');

  if (totalHabitsCount >= 1) unlockBadge('create_1');
  if (totalHabitsCount >= 3) unlockBadge('create_3');
  if (totalHabitsCount >= 5) unlockBadge('create_5');
  if (totalHabitsCount >= 10) unlockBadge('create_10');
  if (habits.some(h => h.target)) unlockBadge('target_1');
  if (habits.some(h => h.days && h.days.length === 5 && h.days.every(d => d >= 1 && d <= 5))) unlockBadge('weekdays_only');
  if (habits.some(h => h.days && (h.days.includes(6) || h.days.includes(0)))) unlockBadge('weekend_hero');

  if (totalCompletedCompletions >= 1) unlockBadge('done_1');
  if (totalCompletedCompletions >= 10) unlockBadge('done_10');
  if (totalCompletedCompletions >= 50) unlockBadge('done_50');
  if (totalCompletedCompletions >= 100) unlockBadge('done_100');
  if (totalCompletedCompletions >= 250) unlockBadge('done_250');
  if (totalCompletedCompletions >= 500) unlockBadge('done_500');
  if (totalCompletedCompletions >= 1000) unlockBadge('done_1000');

  const perfectDaysCount = Object.values(history).filter(v => v === 1).length;
  if (perfectDaysCount >= 1) unlockBadge('full_day_1');
  if (perfectDaysCount >= 7) unlockBadge('full_day_7');

  if (userXp >= 50) unlockBadge('xp_50');
  if (userXp >= 200) unlockBadge('xp_200');
  if (userXp >= 500) unlockBadge('xp_500');
  if (userXp >= 1000) unlockBadge('xp_1000');
  if (level >= 2) unlockBadge('lvl_2');
  if (level >= 5) unlockBadge('lvl_5');
  if (level >= 10) unlockBadge('lvl_10');
  if (level >= 20) unlockBadge('lvl_20');

  if (pomosCompleted >= 1) unlockBadge('pomo_1');
  if (pomosCompleted >= 5) unlockBadge('pomo_5');
  if (pomosCompleted >= 10) unlockBadge('pomo_10');
  if (pomosCompleted >= 25) unlockBadge('pomo_25');
  if (pomosCompleted >= 50) unlockBadge('pomo_50');
  if (pomosCompleted >= 100) unlockBadge('pomo_100');

  if (notesDaysCount >= 1) unlockBadge('note_1');
  if (notesDaysCount >= 5) unlockBadge('note_5');
  if (notesDaysCount >= 15) unlockBadge('note_15');
  if (notesDaysCount >= 30) unlockBadge('note_30');
  if (todayNote.length >= 100) unlockBadge('note_long');

  if (streakFrozenDate) unlockBadge('freeze_1');
  if (customCategories.length > 3) unlockBadge('cat_new');
  if (unlockedBadges.length >= 45) unlockBadge('all_badges');
}

function unlockBadge(badgeId) {
  if (!unlockedBadges.includes(badgeId)) {
    unlockedBadges.push(badgeId);
    playSound('fanfare');
    renderBadges();
  }
}

function renderGamification() {
  const level = Math.floor(userXp / 100) + 1;
  const xpCurrent = userXp % 100;
  const titles = ["Novato", "Constante", "Disciplinado", "Maestro", "Imparable", "Leyenda", "Semidios", "Titan"];
  const title = titles[Math.min(level - 1, titles.length - 1)];

  $("userLevel").textContent = level;
  $("userTitle").textContent = title;
  $("xpText").textContent = `${xpCurrent} / 100 XP`;
  $("xpBarFill").style.width = `${xpCurrent}%`;

  const today = todayStr();
  const freezeBtn = $("freezeStreakBtn");
  if (streakFrozenDate === today) {
    freezeBtn.classList.add("used");
    $("freezeBtnText").textContent = "Racha Congelada Hoy 🧊";
  } else {
    freezeBtn.classList.remove("used");
    $("freezeBtnText").textContent = "Congelar Racha (1 Disp.)";
  }

  checkBadges();
  renderBadges();
}

function renderBadges() {
  const container = $("badgesGrid");
  $("badgesCounter").textContent = `${unlockedBadges.length} / ${ALL_BADGES.length}`;

  container.innerHTML = ALL_BADGES.map(b => {
    const isUnlocked = unlockedBadges.includes(b.id);
    return `
      <div class="badge-card ${isUnlocked ? 'unlocked' : ''}" title="${escapeHtml(b.desc)}">
        <div class="badge-icon">${b.icon}</div>
        <div class="badge-title">${escapeHtml(b.title)}</div>
        <div class="badge-desc">${escapeHtml(b.desc)}</div>
      </div>
    `;
  }).join('');
}

$("freezeStreakBtn").addEventListener("click", () => {
  const today = todayStr();
  if (streakFrozenDate === today) return alert("❄️ Ya has congelado tu racha el día de hoy.");
  if (confirm("¿Quieres usar 1 comodín para proteger tu racha hoy aunque no completes tus hábitos?")) {
    streakFrozenDate = today;
    unlockBadge('freeze_1');
    queueCloudSave();
    renderGamification();
    calculateStreak();
  }
});

/* ==========================================================================
   NOTAS DIARIAS
   ========================================================================== */

const dailyNotesInput = $("dailyNotesInput");
const debouncedNoteSave = debounce(() => {
  queueCloudSave();
  checkBadges();
  renderBadges();
  $("notesSaveHint").textContent = "Guardado ✓";
  setTimeout(() => { $("notesSaveHint").textContent = ""; }, 1500);
}, 600);

dailyNotesInput.addEventListener("input", (e) => {
  dailyNotes[todayStr()] = e.target.value;
  $("notesSaveHint").textContent = "Guardando...";
  debouncedNoteSave();
});

function loadDailyNote() {
  dailyNotesInput.value = dailyNotes[todayStr()] || "";
}

/* ==========================================================================
   POMODORO
   ========================================================================== */

let pomoInterval = null;
let pomoTimeLeft = 25 * 60;
let currentPomoHabitId = null;

function openPomo(id, name) {
  currentPomoHabitId = id;
  $("pomoHabitTitle").textContent = `Modo Enfoque: ${name}`;
  $("pomoModal").classList.remove("hidden");
  resetPomo();
}

function resetPomo() {
  clearInterval(pomoInterval);
  pomoInterval = null;
  pomoTimeLeft = 25 * 60;
  updatePomoDisplay();
  $("pomoStartBtn").textContent = "Iniciar";
}

function updatePomoDisplay() {
  const mins = Math.floor(pomoTimeLeft / 60).toString().padStart(2, '0');
  const secs = (pomoTimeLeft % 60).toString().padStart(2, '0');
  $("pomoTimer").textContent = `${mins}:${secs}`;
}

$("pomoStartBtn").addEventListener("click", () => {
  if (pomoInterval) {
    clearInterval(pomoInterval);
    pomoInterval = null;
    $("pomoStartBtn").textContent = "Continuar";
  } else {
    $("pomoStartBtn").textContent = "Pausar";
    pomoInterval = setInterval(() => {
      if (pomoTimeLeft > 0) {
        pomoTimeLeft--;
        updatePomoDisplay();
      } else {
        clearInterval(pomoInterval);
        pomoInterval = null;
        playSound('fanfare');
        addXp(25);
        pomosCompleted++;
        checkBadges();
        queueCloudSave();
        alert("🎉 ¡Sesión Pomodoro completada! (+25 XP)");
        if (currentPomoHabitId) toggleHabit(currentPomoHabitId);
        $("pomoModal").classList.add("hidden");
      }
    }, 1000);
  }
});

$("pomoCloseBtn").addEventListener("click", () => {
  clearInterval(pomoInterval);
  $("pomoModal").classList.add("hidden");
});

/* ==========================================================================
   PERSISTENCIA (Firestore + caché local)
   ========================================================================== */

function persistLocalCache() {
  localStorage.setItem("trackerHabits_v2", JSON.stringify(habits));
  localStorage.setItem("trackerHistory_v2", JSON.stringify(history));
  localStorage.setItem("trackerNotes_v2", JSON.stringify(dailyNotes));
  localStorage.setItem("trackerXp_v2", JSON.stringify(userXp));
  if (streakFrozenDate) localStorage.setItem("trackerFreeze_v2", streakFrozenDate);
  localStorage.setItem("trackerBadges_v2", JSON.stringify(unlockedBadges));
  localStorage.setItem("trackerPomos_v2", JSON.stringify(pomosCompleted));
  localStorage.setItem("trackerCategories_v2", JSON.stringify(customCategories));
}

async function saveToCloud() {
  persistLocalCache();
  if (!user) return;
  try {
    showSyncIndicator("Sincronizando...");
    const docId = user.email.replace(/[^a-zA-Z0-9]/g, "_");
    await setDoc(doc(db, "userData", docId), {
      habits, history, dailyNotes, userXp, streakFrozenDate, unlockedBadges, pomosCompleted,
      categories: customCategories,
      theme: localStorage.getItem("trackerTheme_v2") || "theme-naranja"
    }, { merge: true });
  } catch (err) {
    console.error("Error al sincronizar con la nube:", err);
  } finally {
    hideSyncIndicator();
  }
}

// Evita golpear Firestore en cada micro-cambio (drag&drop, toggles rápidos, etc.)
const queueCloudSave = debounce(saveToCloud, 500);

async function syncFromCloud() {
  if (!user) return;
  try {
    showSyncIndicator("Cargando tus datos...");
    const docId = user.email.replace(/[^a-zA-Z0-9]/g, "_");
    const ref = doc(db, "userData", docId);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data();
      habits = data.habits || [];
      history = data.history || {};
      dailyNotes = data.dailyNotes || {};
      userXp = data.userXp || 0;
      streakFrozenDate = data.streakFrozenDate || null;
      unlockedBadges = data.unlockedBadges || [];
      pomosCompleted = data.pomosCompleted || 0;
      customCategories = data.categories || ["Salud", "Estudio", "Personal"];
      if (data.theme) setTheme(data.theme);
    } else {
      habits = JSON.parse(localStorage.getItem("trackerHabits_v2")) || [];
      history = JSON.parse(localStorage.getItem("trackerHistory_v2")) || {};
      dailyNotes = JSON.parse(localStorage.getItem("trackerNotes_v2")) || {};
      userXp = JSON.parse(localStorage.getItem("trackerXp_v2")) || 0;
      streakFrozenDate = localStorage.getItem("trackerFreeze_v2") || null;
      unlockedBadges = JSON.parse(localStorage.getItem("trackerBadges_v2")) || [];
      pomosCompleted = JSON.parse(localStorage.getItem("trackerPomos_v2")) || 0;
      customCategories = JSON.parse(localStorage.getItem("trackerCategories_v2")) || ["Salud", "Estudio", "Personal"];
    }
  } catch (err) {
    console.error("Error al cargar datos de la nube, usando caché local:", err);
    habits = JSON.parse(localStorage.getItem("trackerHabits_v2")) || [];
    history = JSON.parse(localStorage.getItem("trackerHistory_v2")) || {};
  } finally {
    hideSyncIndicator();
  }

  checkDailyReset();
  renderCategoryOptions();
  loadDailyNote();
  renderGamification();
  saveAndRender(false);
}

function checkDailyReset() {
  const today = todayStr();
  const lastOpened = localStorage.getItem("trackerLastDate_v2");
  if (lastOpened !== today) {
    habits = habits.map(h => {
      const wasDone = h.completed || (h.target && h.current >= h.target);
      return { ...h, completed: false, current: 0, streak: wasDone ? (h.streak || 0) : 0 };
    });
    localStorage.setItem("trackerLastDate_v2", today);
    queueCloudSave();
  }
}

/* ==========================================================================
   AUTENTICACIÓN (simple, sin Firebase Auth — por decisión del usuario)
   ========================================================================== */

function checkAuth() {
  if (!user) {
    $("authOverlay").classList.remove("hidden");
  } else {
    $("authOverlay").classList.add("hidden");
    $("profileName").textContent = user.email;
    syncFromCloud();
  }
}

$("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = $("loginEmail").value.trim().toLowerCase();
  const pass = $("loginPass").value.trim();
  const errorEl = $("authError");
  const btn = $("loginBtn");
  errorEl.textContent = "";

  if (!email || !pass) { errorEl.textContent = "Introduce correo y contraseña."; return; }

  btn.disabled = true;
  $("loginBtnText").innerHTML = `<span class="spinner"></span> Entrando...`;

  try {
    const docId = email.replace(/[^a-zA-Z0-9]/g, "_");
    const ref = doc(db, "users", docId);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      if (snap.data().password !== pass) {
        errorEl.textContent = "Contraseña incorrecta.";
        return;
      }
    } else {
      await setDoc(ref, { email, password: pass });
    }

    user = { email };
    checkAuth();
  } catch (err) {
    console.error("Error de autenticación:", err);
    errorEl.textContent = "No se pudo conectar. Revisa tu conexión e inténtalo de nuevo.";
  } finally {
    btn.disabled = false;
    $("loginBtnText").textContent = "Entrar / Registrarse";
  }
});

/* ==========================================================================
   CATEGORÍAS Y FILTROS
   ========================================================================== */

const categorySelect = $("categorySelect");
categorySelect.addEventListener("change", (e) => {
  if (e.target.value === "__NEW__") {
    const newCat = prompt("Nueva categoría:");
    if (newCat && newCat.trim() !== "") {
      const formatted = newCat.trim();
      if (!customCategories.includes(formatted)) customCategories.push(formatted);
      unlockBadge('cat_new');
      renderCategoryOptions();
      categorySelect.value = formatted;
    } else {
      categorySelect.value = customCategories[0] || "Personal";
    }
  }
});

function renderCategoryOptions() {
  categorySelect.innerHTML = customCategories.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('') +
    `<option value="__NEW__">+ Nueva categoría...</option>`;

  const filtersBar = $("filtersBar");
  filtersBar.innerHTML = `<button type="button" class="filter-btn ${activeFilter === 'Todos' ? 'active' : ''}" data-filter="Todos">Todos</button>` +
    customCategories.map(c => `<button type="button" class="filter-btn ${activeFilter === c ? 'active' : ''}" data-filter="${escapeHtml(c)}">${escapeHtml(c)}</button>`).join('');
}

$("filtersBar").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-filter]");
  if (!btn) return;
  activeFilter = btn.dataset.filter;
  renderCategoryOptions();
  renderHabits();
});

/* ==========================================================================
   HÁBITOS — CRUD
   ========================================================================== */

$("addHabitForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const text = $("habitInput").value.trim();
  const cat = categorySelect.value;
  const targetVal = parseInt($("habitTarget").value, 10) || null;
  const selectedDays = Array.from(document.querySelectorAll(".day-btn.selected")).map(b => +b.dataset.day);

  if (!text || cat === "__NEW__") return;
  if (selectedDays.length === 0) return alert("⚠️ Selecciona al menos un día de la semana para programar el hábito.");

  habits.push({ id: Date.now(), name: text, category: cat, completed: false, days: selectedDays, target: targetVal, current: 0, streak: 0 });

  $("habitInput").value = "";
  $("habitTarget").value = "";
  saveAndRender();
});

function toggleHabit(id) {
  habits = habits.map(h => {
    if (h.id !== id) return h;
    const isDone = !h.completed;
    let newStreak = h.streak || 0;
    if (isDone) { newStreak++; playSound('check'); addXp(10); }
    else { newStreak = Math.max(0, newStreak - 1); playSound('uncheck'); addXp(-10); }
    return { ...h, completed: isDone, current: isDone && h.target ? h.target : 0, streak: newStreak };
  });
  saveAndRender();
}

function updateQuant(id, val) {
  habits = habits.map(h => {
    if (h.id !== id) return h;
    const cur = Math.max(0, parseInt(val, 10) || 0);
    const wasDone = h.completed;
    const isDone = h.target ? cur >= h.target : false;
    let newStreak = h.streak || 0;
    if (isDone && !wasDone) { newStreak++; playSound('check'); addXp(10); }
    else if (!isDone && wasDone) { newStreak = Math.max(0, newStreak - 1); playSound('uncheck'); addXp(-10); }
    return { ...h, current: cur, completed: isDone, streak: newStreak };
  });
  saveAndRender();
}

function deleteHabit(id) {
  if (confirm("¿Estás seguro de que deseas eliminar este hábito?")) {
    habits = habits.filter(h => h.id !== id);
    saveAndRender();
  }
}

function saveAndRender(triggerCloud = true) {
  const today = todayStr();
  const todayDayOfWeek = new Date().getDay();

  const activeTodayHabits = habits.filter(h => !h.days || h.days.includes(todayDayOfWeek));
  const total = activeTodayHabits.length;
  const done = activeTodayHabits.filter(h => h.completed || (h.target && h.current >= h.target)).length;

  history[today] = total > 0 ? (done / total) : 0;

  if (total > 0 && done === total) {
    if (!wasAllCompletedToday) {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      playSound('fanfare');
      addXp(20);
      wasAllCompletedToday = true;
    }
  } else {
    wasAllCompletedToday = false;
  }

  calculateStreak();
  checkBadges();
  if (triggerCloud) queueCloudSave();

  renderGamification();
  renderHabits();
  renderCharts();
}

/* ==========================================================================
   RENDER: LISTA DE HÁBITOS (con delegación de eventos, sin onclick inline)
   ========================================================================== */

function renderHabits() {
  const todayDayOfWeek = new Date().getDay();
  const habitList = $("habitList");
  const filtered = habits.filter(h => activeFilter === "Todos" || h.category === activeFilter);

  if (filtered.length === 0) {
    habitList.innerHTML = `<li class="habit-empty">Sin hábitos en esta categoría.</li>`;
    return;
  }

  habitList.innerHTML = filtered.map(h => {
    const isScheduledToday = !h.days || h.days.includes(todayDayOfWeek);
    const isDone = h.completed || (h.target && h.current >= h.target);

    const daysPills = DAY_LABELS_SHORT.map(d => {
      const isActive = h.days && h.days.includes(d.id);
      const isToday = d.id === todayDayOfWeek;
      return `<span class="mini-day-pill ${isActive ? 'active-day' : ''} ${isToday ? 'is-today-pill' : ''}">${d.label}</span>`;
    }).join('');

    const safeName = escapeHtml(h.name);
    const safeCat = escapeHtml(h.category);

    return `
      <li id="habit-${h.id}" class="habit-item ${!isScheduledToday ? 'not-today' : ''} ${isDone ? 'completed' : ''}" draggable="true" data-id="${h.id}">
        <div class="habit-details">
          <div class="habit-title-row">
            <span class="habit-title">${safeName}</span>
            ${h.streak ? `<span class="habit-streak-badge">🔥 ${h.streak}d</span>` : ''}
          </div>
          <span class="habit-category-subtitle">${safeCat} ${!isScheduledToday ? '• <i style="color:var(--text-muted); font-weight:normal;">(Inactivo hoy)</i>' : ''}</span>
          <div class="habit-days-pills">${daysPills}</div>
        </div>
        <div class="habit-actions">
          <button type="button" class="btn-action pomo" data-action="pomo" title="Temporizador Pomodoro" aria-label="Iniciar pomodoro para ${safeName}">⏱️</button>
          ${h.target ? `
            <input type="number" class="quant-input" value="${h.current || 0}" max="${h.target}" data-action="quant" ${!isScheduledToday ? 'disabled' : ''} aria-label="Progreso de ${safeName}">
            <span style="font-size: 12px; color: var(--text-muted);">/ ${h.target}</span>
          ` : `
            <button type="button" class="btn-action ${isDone ? 'check' : ''}" data-action="toggle" ${!isScheduledToday ? 'disabled' : ''} aria-label="Marcar ${safeName} como ${isDone ? 'pendiente' : 'hecho'}">${isDone ? '✓' : '◯'}</button>
          `}
          <button type="button" class="btn-action delete" data-action="delete" aria-label="Eliminar ${safeName}">✕</button>
        </div>
      </li>
    `;
  }).join('');

  setupDragAndDrop();
}

// Delegación de eventos: un único listener para toda la lista.
$("habitList").addEventListener("click", (e) => {
  const actionEl = e.target.closest("[data-action]");
  if (!actionEl) return;
  const li = e.target.closest(".habit-item");
  const id = Number(li?.dataset.id);
  if (!id) return;

  const action = actionEl.dataset.action;
  if (action === "toggle") toggleHabit(id);
  else if (action === "delete") deleteHabit(id);
  else if (action === "pomo") {
    const habit = habits.find(h => h.id === id);
    if (habit) openPomo(id, habit.name);
  }
});
$("habitList").addEventListener("change", (e) => {
  if (e.target.dataset.action !== "quant") return;
  const li = e.target.closest(".habit-item");
  const id = Number(li?.dataset.id);
  if (id) updateQuant(id, e.target.value);
});

function setupDragAndDrop() {
  const list = $("habitList");
  let draggedItem = null;

  list.querySelectorAll(".habit-item").forEach(item => {
    item.addEventListener("dragstart", () => {
      draggedItem = item;
      setTimeout(() => item.classList.add("dragging"), 0);
    });
    item.addEventListener("dragend", () => {
      item.classList.remove("dragging");
      draggedItem = null;
      const newOrderIds = Array.from(list.querySelectorAll(".habit-item")).map(el => Number(el.dataset.id));
      habits.sort((a, b) => newOrderIds.indexOf(a.id) - newOrderIds.indexOf(b.id));
      queueCloudSave();
    });
  });

  list.addEventListener("dragover", (e) => {
    e.preventDefault();
    if (!draggedItem) return;
    const afterElement = getDragAfterElement(list, e.clientY);
    if (afterElement == null) list.appendChild(draggedItem);
    else list.insertBefore(draggedItem, afterElement);
  });
}

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll(".habit-item:not(.dragging)")];
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) return { offset, element: child };
    return closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

/* ==========================================================================
   GRÁFICAS
   ========================================================================== */

function renderCharts() {
  const todayDayOfWeek = new Date().getDay();
  const activeToday = habits.filter(h => !h.days || h.days.includes(todayDayOfWeek));
  const total = activeToday.length;
  const done = activeToday.filter(h => h.completed || (h.target && h.current >= h.target)).length;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  $("pieSegment").setAttribute("stroke-dasharray", `${percent} 100`);
  $("piePercent").textContent = `${percent}%`;

  renderMonthlyLineChart();
  renderYearGrid();
}

function renderMonthlyLineChart() {
  const monthlySvg = $("monthlyLineChart");
  monthlySvg.innerHTML = "";

  const points = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const val = history[dateStr] || 0;

    const x = ((29 - i) / 29) * 280 + 10;
    const y = 90 - (val * 70);
    points.push(`${x},${y}`);

    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", "3.5");
    circle.setAttribute("fill", "var(--accent-color)");
    monthlySvg.appendChild(circle);
  }

  const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
  polyline.setAttribute("fill", "none");
  polyline.setAttribute("stroke", "var(--accent-color)");
  polyline.setAttribute("stroke-width", "2.5");
  polyline.setAttribute("points", points.join(" "));
  monthlySvg.prepend(polyline);
}

function renderYearGrid() {
  const yearGrid = $("yearGrid");
  const frag = document.createDocumentFragment();

  for (let i = 364; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayProgress = history[dateStr] || 0;

    let lvl = "";
    if (dayProgress >= 1) lvl = "lvl-gold";
    else if (dayProgress > 0.6) lvl = "lvl-3";
    else if (dayProgress > 0.3) lvl = "lvl-2";
    else if (dayProgress > 0) lvl = "lvl-1";

    const yDot = document.createElement("div");
    yDot.className = `year-dot ${lvl}`;
    yDot.title = `${dateStr}: ${Math.round(dayProgress * 100)}%`;
    frag.appendChild(yDot);
  }

  yearGrid.innerHTML = "";
  yearGrid.appendChild(frag);
}

/* ==========================================================================
   RACHA
   ========================================================================== */

function calculateStreak() {
  const today = todayStr();
  const todayProgress = history[today] || 0;
  const isTodayCompleted = todayProgress > 0 || streakFrozenDate === today;

  let streak = 0;
  let d = new Date();
  if (!isTodayCompleted) d.setDate(d.getDate() - 1);

  while (true) {
    const dateStr = d.toISOString().split('T')[0];
    if ((history[dateStr] && history[dateStr] > 0) || streakFrozenDate === dateStr) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else break;
  }

  currentStreak = streak;
  $("streakCount").textContent = currentStreak;

  const container = $("streakContainer");
  if (!isTodayCompleted && currentStreak === 0) container.className = "streak-tag streak-grey";
  else if (currentStreak >= 365) container.className = "streak-tag streak-gold";
  else if (currentStreak >= 100) container.className = "streak-tag streak-purple-gold";
  else if (currentStreak >= 50) container.className = "streak-tag streak-green";
  else if (currentStreak >= 30) container.className = "streak-tag streak-blue";
  else if (currentStreak >= 10) container.className = "streak-tag streak-red";
  else container.className = "streak-tag streak-orange";

  const goldDot = $("goldThemeDot");
  if (currentStreak >= 365) { goldDot.classList.remove("locked"); goldDot.textContent = ""; }
  else { goldDot.classList.add("locked"); goldDot.textContent = "🔒"; }
}

/* ==========================================================================
   EXPORTAR / IMPORTAR
   ========================================================================== */

$("exportJsonBtn").addEventListener("click", () => {
  unlockBadge('export_data');
  const exportData = {
    habits, history, dailyNotes, userXp, streakFrozenDate, unlockedBadges, pomosCompleted,
    categories: customCategories, theme: localStorage.getItem("trackerTheme_v2") || "theme-naranja"
  };
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ethos_backup_${todayStr()}.json`;
  a.click();
  URL.revokeObjectURL(url);
});

$("importJsonBtn").addEventListener("click", () => $("importJsonInput").click());

$("importJsonInput").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const imported = JSON.parse(event.target.result);
      if (!imported.habits || !imported.history) throw new Error("Formato inválido");

      habits = imported.habits;
      history = imported.history;
      if (imported.dailyNotes) dailyNotes = imported.dailyNotes;
      if (imported.userXp !== undefined) userXp = imported.userXp;
      if (imported.streakFrozenDate) streakFrozenDate = imported.streakFrozenDate;
      if (imported.unlockedBadges) unlockedBadges = imported.unlockedBadges;
      if (imported.pomosCompleted !== undefined) pomosCompleted = imported.pomosCompleted;
      if (imported.categories) customCategories = imported.categories;
      if (imported.theme) setTheme(imported.theme);

      loadDailyNote();
      renderCategoryOptions();
      renderGamification();
      saveAndRender();
      alert("¡Datos importados y sincronizados correctamente!");
    } catch (err) {
      console.error(err);
      alert("⚠️ Error al procesar el archivo JSON.");
    }
  };
  reader.readAsText(file);
});

/* ==========================================================================
   PANEL DE PERFIL / SESIÓN
   ========================================================================== */

$("openProfile").addEventListener("click", () => $("profilePanel").classList.toggle("hidden"));
$("closeProfile").addEventListener("click", () => $("profilePanel").classList.add("hidden"));
$("clearLocal").addEventListener("click", () => {
  if (confirm("¿Estás seguro de cerrar sesión?")) {
    localStorage.clear();
    location.reload();
  }
});

/* ==========================================================================
   ARRANQUE
   ========================================================================== */

checkAuth();

const APP_VERSION = "v1.6";

const DAYS = [
    { id: 'lundi', name: 'Lundi', focus: 'Pecs & Triceps', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>' },
    { id: 'mardi', name: 'Mardi', focus: 'Dos & Biceps', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>' },
    { id: 'mercredi', name: 'Mercredi', focus: 'Cardio (1 sur 2)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>' },
    { id: 'jeudi', name: 'Jeudi', focus: 'Jambes (Quadri & Ischios)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>' },
    { id: 'vendredi', name: 'Vendredi', focus: 'Full Haut du Corps', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>' }
];

const EXERCISES = {
    lundi: [
        { id: 'dc_barre', name: 'Développé Couché Barre' },
        { id: 'di_halteres', name: 'Développé Incliné Haltères' },
        { id: 'pullover_haltere', name: 'Pull-over Haltère' },
        { id: 'dips', name: 'Dips (lestés si possible)' },
        { id: 'skull_crusher', name: 'Barre au Front (Skull Crusher)' }
    ],
    mardi: [
        { id: 'tractions', name: 'Tractions / Traction lestée' },
        { id: 'rowing_barre', name: 'Rowing Barre (penchée en avant)' },
        { id: 'tirage_poitrine', name: 'Tirage Poitrine Barre (Lat Pulldown)' },
        { id: 'curl_barre_ez', name: 'Curl Barre EZ' },
        { id: 'curl_marteau', name: 'Curl Marteau Haltères' }
    ],
    mercredi: [
        { id: 'cardio', name: 'Course / Vélo / Elliptique (30-45m)' }
    ],
    jeudi: [
        { id: 'squat_barre', name: 'Squat Barre (Quadriceps)' },
        { id: 'leve_jambe', name: 'Leg Extension Machine (Quadriceps)' },
        { id: 'fentes_halteres', name: 'Fentes Haltères (Quadriceps)' },
        { id: 'rdl_halteres', name: 'Soulevé de Terre Jambes Tendues Haltères (Ischios)' },
        { id: 'leg_curl', name: 'Leg Curl Assis (Ischios)' }
    ],
    vendredi: [
        { id: 'dev_milit_halteres', name: 'Développé Militaire Haltères (Deltoïdes antérieurs)' },
        { id: 'elev_lat', name: 'Élévations Latérales Haltères (Deltoïdes latéraux)' },
        { id: 'oiseau', name: 'Oiseau / Face Pull (Deltoïdes postérieurs)' },
        { id: 'tirage_poulie_basse', name: 'Tirage Horizontal Poulie Basse (Dos)' },
        { id: 'dev_incline_machine', name: 'Développé Incliné Machine (Pecs)' },
        { id: 'superset_bras', name: 'Superset — Curl Concentration (Biceps) + Kickback Haltère (Triceps)' }
    ]
};

// Temps de repos recommandés (en secondes) par exercice
const REST_TIMES = {
    // Lundi — composés pecs/triceps
    dc_barre: 120,  // Développé Couché Barre
    di_halteres: 90,   // Développé Incliné
    pullover_haltere: 75,   // Pull-over
    dips: 90,   // Dips
    skull_crusher: 75,   // Barre au Front

    // Mardi — composés dos/biceps
    tractions: 120,  // Tractions
    rowing_barre: 120,  // Rowing Barre
    tirage_poitrine: 90,   // Tirage Poitrine
    curl_barre_ez: 75,   // Curl EZ
    curl_marteau: 60,   // Curl Marteau

    // Jeudi — jambes
    squat_barre: 150,  // Squat Barre (plus lourd)
    leve_jambe: 75,   // Leg Extension
    fentes_halteres: 90,   // Fentes
    rdl_halteres: 120,  // RDL
    leg_curl: 75,   // Leg Curl Assis

    // Vendredi — isolé
    dev_milit_halteres: 90, // Développé Militaire
    elev_lat: 60,   // Élévations Latérales
    oiseau: 60,   // Oiseau / Face Pull
    tirage_poulie_basse: 75, // Dos finition
    dev_incline_machine: 90, // Développé Incliné Machine
    superset_bras: 60,   // Superset Bras

    // Cardio — pas de timer
    cardio: 0
};

// Nombre de séries recommandées par exercice
// 4 séries pour les composés lourds, 3 pour les isolations
const SETS_COUNT = {
    // Lundi — 4 séries sur les composés, 3 sur les accessoires
    dc_barre: 4,          // Composé lourd #1
    di_halteres: 4,       // Composé lourd #2
    pullover_haltere: 3,  // Accessoire
    dips: 4,              // Composé polyarticulaire
    skull_crusher: 3,     // Isolation triceps
    // Mardi — 4 séries sur les tractions/rowing, 3 sur les bras
    tractions: 4,         // Composé lourd #1
    rowing_barre: 4,      // Composé lourd #2
    tirage_poitrine: 3,   // Accessoire
    curl_barre_ez: 3,     // Isolation biceps
    curl_marteau: 3,      // Isolation
    // Jeudi — 4 séries sur squat et RDL, 3 sur le reste
    squat_barre: 4,       // Composé lourd #1
    leve_jambe: 3,        // Machine isolation
    fentes_halteres: 3,   // Accessoire
    rdl_halteres: 3,      // Accessoire ischios
    leg_curl: 4,          // Machine isolation assis
    // Vendredi — 4 séries sur le militaire, 3 sur les isolations
    dev_milit_halteres: 4, // Composé
    elev_lat: 3,           // Isolation
    oiseau: 3,             // Isolation
    tirage_poulie_basse: 3, // Dos finition
    dev_incline_machine: 4, // Composé pecs
    superset_bras: 3,      // Superset
    // Cardio
    cardio: 1
};

// =============================================
// PROFIL UTILISATEUR & ISOLATION DONNÉES
// =============================================
let currentUserId = localStorage.getItem('my_user_id') || null;

function getKey(name) {
    return `${currentUserId}_${name}`;
}

window.confirmProfile = function () {
    const input = document.getElementById('profile-name-input');
    const name = input.value.trim();
    if (!name) { input.classList.add('shake'); setTimeout(() => input.classList.remove('shake'), 400); return; }
    const userId = name.toLowerCase().replace(/\s+/g, '_');
    localStorage.setItem('my_user_id', userId);
    currentUserId = userId;
    document.getElementById('profile-overlay').classList.add('hidden');
    initApp();
};

// Appui Entrée sur l'input
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('profile-name-input');
    if (input) input.addEventListener('keydown', e => { if (e.key === 'Enter') window.confirmProfile(); });
});

window.switchProfile = function () {
    localStorage.removeItem('my_user_id');
    location.reload();
};

// =============================================
// DÉVERROUILLAGE AUDIO IOS
// =============================================
let audioUnlocked = false;
function unlockAudio() {
    if (audioUnlocked) return;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    ctx.resume().then(() => { audioUnlocked = true; });
    document.removeEventListener('touchstart', unlockAudio);
    document.removeEventListener('click', unlockAudio);
}
document.addEventListener('touchstart', unlockAudio, { once: true });
document.addEventListener('click', unlockAudio, { once: true });

// =============================================
// STATE & DOM
// =============================================
let currentView = 'home';
let activeWorkoutDay = null;
let currentWorkoutData = {};

const mainContent = document.getElementById('main-content');
const backBtn = document.getElementById('back-btn');
const headerSubtitle = document.getElementById('header-subtitle');
const navBtns = document.querySelectorAll('.nav-btn');
const toast = document.getElementById('toast');

let historyData = [];

// =============================================
// INITIALISATION
// =============================================
let listenersInitialized = false;

function initApp() {
    historyData = JSON.parse(localStorage.getItem(getKey('my_workout_history'))) || [];

    // Afficher le nom du profil et le lien changer dans le header
    const existingProfileBtn = document.getElementById('profile-switch-btn');
    if (!existingProfileBtn) {
        const profileBtn = document.createElement('button');
        profileBtn.id = 'profile-switch-btn';
        profileBtn.className = 'profile-switch-btn';
        profileBtn.title = 'Changer de profil';
        profileBtn.innerHTML = `<span>${currentUserId.replace(/_/g, ' ')}</span> <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
        profileBtn.onclick = switchProfile;
        document.querySelector('.header-content').appendChild(profileBtn);
    }

    // Ajouter les listeners une seule fois (protection contre double-init)
    if (!listenersInitialized) {
        navBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                switchView(view);
            });
        });
        backBtn.addEventListener('click', () => switchView('home'));
        listenersInitialized = true;
    }

    switchView('home');
}

// Lancement au démarrage
if (currentUserId) {
    initApp();
} else {
    // Afficher l'écran de profil
    document.getElementById('profile-overlay').classList.remove('hidden');
    const input = document.getElementById('profile-name-input');
    if (input) setTimeout(() => input.focus(), 100);
}


// Navigation Logic
function switchView(view) {
    currentView = view;
    navBtns.forEach(b => b.classList.remove('active'));

    if (view === 'home' || view === 'history') {
        const btn = document.querySelector(`.nav-btn[data-view="${view}"]`);
        if (btn) btn.classList.add('active');
        backBtn.classList.add('hidden');
        headerSubtitle.textContent = view === 'home' ? 'Progression & Hypertrophie' : 'Historique des Séances';
        document.querySelector('.header-content').style.marginLeft = '0';
    }

    mainContent.innerHTML = '';

    if (view === 'home') renderHome();
    else if (view === 'history') renderHistory();
    else if (view === 'workout') {
        document.querySelector('.nav-btn[data-view="home"]').classList.add('active');
        backBtn.classList.remove('hidden');
        document.querySelector('.header-content').style.marginLeft = '0';
    }
}

// Renders
function estimateDay(dayId) {
    const exos = EXERCISES[dayId] || [];
    if (dayId === 'mercredi') return '30–45 min';
    const EFFORT_PER_SET = 40; // secondes d'effort moyen par série
    let totalSec = 0;
    exos.forEach(ex => {
        const rest = REST_TIMES[ex.id] ?? 90;
        const sets = SETS_COUNT[ex.id] ?? 3;
        totalSec += sets * (EFFORT_PER_SET + rest);
    });
    // +10% pour transitions/installation
    totalSec = Math.round(totalSec * 1.1);
    const min = Math.round(totalSec / 60);
    return `~${min} min`;
}

function renderHome() {
    let html = '';
    DAYS.forEach(day => {
        const estimated = estimateDay(day.id);
        html += `
            <div class="day-card" onclick="startWorkout('${day.id}')">
                <div class="day-icon">${day.icon}</div>
                <div class="day-info">
                    <h2>${day.name}</h2>
                    <p>${day.focus}</p>
                    <span class="day-duration">⏱ ${estimated}</span>
                </div>
            </div>
        `;
    });

    // Ajout de la version en bas de la page d'accueil
    html += `<div style="text-align: center; margin-top: 32px; font-size: 13px; color: var(--text-sec); opacity: 0.6; font-weight: 600;">Mon Programme PWA — ${APP_VERSION}</div>`;

    mainContent.innerHTML = html;
}

// Session Timer
let sessionTimerInterval = null;
let sessionStartTime = null;

function startSessionTimer() {
    if (sessionTimerInterval) return; // Déjà en cours
    sessionStartTime = sessionStartTime || Date.now();
    clearInterval(sessionTimerInterval);
    sessionTimerInterval = setInterval(() => {
        const display = document.getElementById('session-timer-display');
        if (!display) { clearInterval(sessionTimerInterval); sessionTimerInterval = null; return; }
        const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
        display.textContent = formatDuration(elapsed);
    }, 1000);
    // Mettre à jour l'icône du bouton
    const startBtn = document.getElementById('session-start-btn');
    if (startBtn) startBtn.textContent = '⏸';
}

function stopSessionTimer() {
    clearInterval(sessionTimerInterval);
    sessionTimerInterval = null;
    if (sessionStartTime) {
        const duration = Math.floor((Date.now() - sessionStartTime) / 1000);
        sessionStartTime = null;
        return duration;
    }
    return 0;
}

window.toggleSessionTimer = function () {
    const startBtn = document.getElementById('session-start-btn');
    if (sessionTimerInterval) {
        // En cours → pause
        clearInterval(sessionTimerInterval);
        sessionTimerInterval = null;
        if (startBtn) startBtn.textContent = '▶';
    } else {
        // Arrêté → start/reprendre
        startSessionTimer();
        if (startBtn) startBtn.textContent = '⏸';
    }
};

function formatDuration(sec) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
}

function startWorkout(dayId) {
    activeWorkoutDay = DAYS.find(d => d.id === dayId);
    currentWorkoutData = {};

    headerSubtitle.textContent = `${activeWorkoutDay.name} - ${activeWorkoutDay.focus}`;
    switchView('workout');

    const exercises = EXERCISES[dayId] || [];

    // Priorité: brouillon → snapshot de référence (derniers poids) → historique → défaut
    const lastWorkout = historyData.filter(h => h.dayId === dayId).sort((a, b) => b.date - a.date)[0];
    const drafts = JSON.parse(localStorage.getItem(getKey('my_workout_drafts'))) || {};
    const refWeights = JSON.parse(localStorage.getItem(getKey('my_reference_weights'))) || {};

    const container = document.createElement('div');

    // Bandeau Chrono de Séance
    const timerBanner = document.createElement('div');
    timerBanner.className = 'session-timer-banner';
    timerBanner.innerHTML = `
        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <span>Durée séance</span>
        <span id="session-timer-display" class="session-timer-value">--:--</span>
        <button id="session-start-btn" class="session-start-btn" onclick="toggleSessionTimer()">▶</button>
    `;
    container.appendChild(timerBanner);

    // Pas de démarrage auto — l'utilisateur clique sur Start

    exercises.forEach((ex, exIndex) => {
        // Init state for this exercise
        const targetSets = SETS_COUNT[ex.id] ?? 3;
        let defaultSets = [];
        if (drafts[dayId] && drafts[dayId][ex.id]) {
            // 1. Brouillon en cours (priorité absolue)
            defaultSets = drafts[dayId][ex.id];
        } else if (refWeights[dayId] && refWeights[dayId][ex.id]) {
            // 2. Snapshot de référence
            defaultSets = refWeights[dayId][ex.id].map(s => ({ ...s, checked: false }));
        } else if (lastWorkout && lastWorkout.data[ex.id]) {
            // 3. Dernier historique trouvé
            defaultSets = lastWorkout.data[ex.id].map(s => ({ ...s, checked: false }));
        } else {
            // 4. Défaut vide
            defaultSets = [];
        }

        // Compléter jusqu'au nombre de séries recommandé
        // (si les données sauvegardées ont moins de séries que le target)
        while (defaultSets.length < targetSets) {
            const last = defaultSets[defaultSets.length - 1];
            defaultSets.push({ kg: last?.kg || '', reps: last?.reps || '', checked: false });
        }

        currentWorkoutData[ex.id] = defaultSets;

        const card = document.createElement('div');
        card.className = 'exercise-card';
        card.innerHTML = `
            <div class="exercise-header">
                <h3>${ex.name}</h3>
            </div>
            <div class="sets-container" id="sets-${ex.id}"></div>
            <button class="btn-add-set" onclick="addSet('${ex.id}')">+ Ajouter une série</button>
        `;
        container.appendChild(card);

        // Render sets later
        setTimeout(() => renderSets(ex.id), 0);
    });

    const saveBtn = document.createElement('button');
    saveBtn.className = 'btn-save-workout';
    saveBtn.textContent = 'Terminer & Sauvegarder';
    saveBtn.onclick = saveWorkout;
    container.appendChild(saveBtn);

    mainContent.appendChild(container);
}

function saveDraft() {
    if (activeWorkoutDay) {
        let drafts = JSON.parse(localStorage.getItem(getKey('my_workout_drafts'))) || {};
        drafts[activeWorkoutDay.id] = currentWorkoutData;
        localStorage.setItem(getKey('my_workout_drafts'), JSON.stringify(drafts));
    }
}

function clearDraft() {
    if (activeWorkoutDay) {
        let drafts = JSON.parse(localStorage.getItem(getKey('my_workout_drafts'))) || {};
        delete drafts[activeWorkoutDay.id];
        localStorage.setItem(getKey('my_workout_drafts'), JSON.stringify(drafts));
    }
}

window.addSet = function (exId) {
    currentWorkoutData[exId].push({ kg: '', reps: '', checked: false });
    renderSets(exId); // Re-render this exercise sets
    saveDraft();
};

window.toggleCheck = function (exId, setIndex) {
    const isChecked = currentWorkoutData[exId][setIndex].checked;
    currentWorkoutData[exId][setIndex].checked = !isChecked;
    renderSets(exId);
    saveDraft();

    if (!isChecked) {
        const rest = REST_TIMES[exId] ?? 90; // Fallback 90s par défaut
        if (rest > 0) startTimer(rest);
    }
};

window.updateInput = function (exId, setIndex, field, value) {
    currentWorkoutData[exId][setIndex][field] = value;
    saveDraft();
};

function renderSets(exId) {
    const container = document.getElementById(`sets-${exId}`);
    if (!container) return;

    const sets = currentWorkoutData[exId];
    let html = '';

    sets.forEach((set, i) => {
        const checkedClass = set.checked ? 'completed' : '';
        const checkIcon = set.checked ?
            '<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>' :
            '<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>';

        html += `
            <div class="set-row">
                <div class="set-number">${i + 1}</div>
                <div class="input-group">
                    <input type="number" step="0.5" placeholder="Poids" value="${set.kg}" onchange="updateInput('${exId}', ${i}, 'kg', this.value)">
                    <span>KG</span>
                </div>
                <div class="input-group">
                    <input type="number" placeholder="Reps" value="${set.reps}" onchange="updateInput('${exId}', ${i}, 'reps', this.value)">
                    <span>REPS</span>
                </div>
                <button class="btn-check ${checkedClass}" onclick="toggleCheck('${exId}', ${i})">
                    ${checkIcon}
                </button>
            </div>
        `;
    });

    container.innerHTML = html;
}

function saveWorkout() {
    const duration = stopSessionTimer(); // Arrête le chrono et récupère la durée en secondes

    const newEntry = {
        id: Date.now(),
        date: Date.now(),
        dayId: activeWorkoutDay.id,
        dayName: activeWorkoutDay.name,
        duration: duration,
        data: currentWorkoutData
    };

    historyData.push(newEntry);
    localStorage.setItem(getKey('my_workout_history'), JSON.stringify(historyData));

    // Snapshot de référence : conserver les derniers poids indépendamment de l'historique
    const refWeights = JSON.parse(localStorage.getItem(getKey('my_reference_weights'))) || {};
    refWeights[activeWorkoutDay.id] = currentWorkoutData;
    localStorage.setItem(getKey('my_reference_weights'), JSON.stringify(refWeights));

    clearDraft();
    showToast();
    switchView('home');
}

function renderHistory() {
    if (historyData.length === 0) {
        mainContent.innerHTML = '<div style="text-align:center; margin-top: 40px; color: var(--text-sec)">Aucune séance enregistrée pour le moment.</div>';
        return;
    }

    const sortedHistory = [...historyData].sort((a, b) => b.date - a.date);
    mainContent.innerHTML = ''; // Nettoyage de la liste
    const container = document.createElement('div');

    sortedHistory.forEach(session => {
        const dateObj = new Date(session.date);
        const dateStr = dateObj.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

        let totalSets = 0;
        let totalVol = 0;
        let detailsHtml = '<div class="history-details">';

        const deleteIcon = '<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>';

        Object.entries(session.data).forEach(([exId, sets]) => {
            let validatedSets = sets.filter(s => s.checked);
            if (validatedSets.length > 0) {
                const exName = EXERCISES[session.dayId]?.find(e => e.id === exId)?.name || exId;
                detailsHtml += `<div class="history-ex-title">
                                    <span>${exName}</span>
                                    <button class="btn-delete-history btn-delete-ex" onclick="deleteHistoryExercise(${session.id}, '${exId}')" title="Supprimer cet exercice">${deleteIcon}</button>
                                </div><ul>`;

                // Track actual index in original sets array to delete correctly
                sets.forEach((s, idx) => {
                    if (s.checked) {
                        totalSets++;
                        if (s.kg && s.reps) totalVol += (parseFloat(s.kg) * parseInt(s.reps));
                        detailsHtml += `<li>Série ${idx + 1} : ${s.kg || 0} kg × ${s.reps || 0} reps <button class="btn-delete-history" onclick="deleteHistorySet(${session.id}, '${exId}', ${idx})" title="Supprimer cette série">${deleteIcon}</button></li>`;
                    }
                });
                detailsHtml += `</ul>`;
            }
        });
        detailsHtml += '</div>';

        const card = document.createElement('div');
        card.className = 'history-item';
        const durationStr = session.duration ? formatDuration(session.duration) : null;
        card.innerHTML = `
            <button class="btn-delete-history" onclick="deleteHistorySession(${session.id})" title="Supprimer toute la séance">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
            <div class="history-date">${dateStr}</div>
            <div class="history-title">${session.dayName}</div>
            <div class="history-stats">
                Séries validées : <b>${totalSets}</b><br>
                Volume total : ${totalVol > 0 ? `<b>${totalVol} kg</b>` : '-'}
                ${durationStr ? `<br>Durée : <b>${durationStr}</b>` : ''}
            </div>
            ${detailsHtml}
        `;
        container.appendChild(card);
    });

    mainContent.appendChild(container);
}

function showToast(msg) {
    toast.textContent = msg || 'Sauvegardé avec succès';
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// --- Modal de confirmation inline ---
function showConfirm(message, onConfirm) {
    // Supprimer un ancien modal s'il existe
    const existing = document.getElementById('confirm-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'confirm-modal';
    modal.innerHTML = `
        <div class="confirm-backdrop"></div>
        <div class="confirm-box">
            <p>${message}</p>
            <div class="confirm-btns">
                <button class="confirm-cancel">Annuler</button>
                <button class="confirm-ok">Supprimer</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('.confirm-cancel').onclick = () => modal.remove();
    modal.querySelector('.confirm-backdrop').onclick = () => modal.remove();
    modal.querySelector('.confirm-ok').onclick = () => {
        modal.remove();
        onConfirm();
    };
}

// History Deletion logic
window.deleteHistorySession = function (sessionId) {
    showConfirm('Supprimer toute cette séance ?', () => {
        historyData = historyData.filter(s => String(s.id) !== String(sessionId));
        localStorage.setItem(getKey('my_workout_history'), JSON.stringify(historyData));
        showToast('Séance supprimée');
        renderHistory();
    });
};

window.deleteHistoryExercise = function (sessionId, exId) {
    showConfirm('Supprimer cet exercice ?', () => {
        const session = historyData.find(s => String(s.id) === String(sessionId));
        if (session && session.data[exId]) {
            delete session.data[exId];
            cleanupSession(session);
        }
    });
};

window.deleteHistorySet = function (sessionId, exId, setIndex) {
    showConfirm('Supprimer cette série ?', () => {
        const session = historyData.find(s => String(s.id) === String(sessionId));
        if (session && session.data[exId]) {
            session.data[exId][setIndex].checked = false;
            const hasLeft = session.data[exId].some(s => s.checked);
            if (!hasLeft) delete session.data[exId];
            cleanupSession(session);
        }
    });
};

function cleanupSession(session) {
    const hasAny = Object.values(session.data).some(sets => sets.some(s => s.checked));
    if (!hasAny) {
        historyData = historyData.filter(s => String(s.id) !== String(session.id));
        showToast('Séance vide, supprimée');
    } else {
        showToast('Historique mis à jour');
    }
    localStorage.setItem(getKey('my_workout_history'), JSON.stringify(historyData));
    renderHistory();
}

// Timer State & Logic
let timerInterval = null;
let timerSeconds = 0;
let isTimerRunning = false;

const timerBar = document.getElementById('timer-bar');
const timerDisplay = document.getElementById('timer-display');
const timerToggleBtn = document.getElementById('timer-toggle-btn');

function updateTimerDisplay() {
    const m = Math.floor(timerSeconds / 60).toString().padStart(2, '0');
    const s = (timerSeconds % 60).toString().padStart(2, '0');
    if (timerDisplay) timerDisplay.textContent = `${m}:${s}`;
}

// Audio Alerte (sans fichier externe)
function playBeep() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        // Son de notification doux (Sinus de A5 descendant à A4)
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.3);

        gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
        console.warn("Audio bloqué ou non supporté");
    }
}

window.startTimer = function (seconds) {
    timerSeconds = seconds;
    isTimerRunning = true;
    if (timerBar) timerBar.classList.remove('hidden');
    updateTimerDisplay();
    updateTimerToggleIcon();

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (!isTimerRunning) return;
        timerSeconds--;
        if (timerSeconds <= 0) {
            timerSeconds = 0;
            clearInterval(timerInterval);
            isTimerRunning = false;
            if (timerBar) timerBar.classList.add('hidden');
            if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
            playBeep();
        }
        updateTimerDisplay();
    }, 1000);
};

window.adjustTimer = function (seconds) {
    timerSeconds += seconds;
    if (timerSeconds < 0) timerSeconds = 0;
    updateTimerDisplay();
};

window.toggleTimer = function () {
    isTimerRunning = !isTimerRunning;
    updateTimerToggleIcon();
};

function updateTimerToggleIcon() {
    if (!timerToggleBtn) return;
    if (isTimerRunning && timerSeconds > 0) {
        timerToggleBtn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>';
    } else {
        timerToggleBtn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
    }
}

window.closeTimer = function () {
    clearInterval(timerInterval);
    isTimerRunning = false;
    if (timerBar) timerBar.classList.add('hidden');
};

// Init
switchView('home');

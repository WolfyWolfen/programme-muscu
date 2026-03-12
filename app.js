const APP_VERSION = "v2.1";

// =============================================
// DONNÉES DE PROGRAMMES & EXERCICES
// =============================================

function getDefaultProgram() {
    return {
        id: 'standard_v1',
        name: 'Split 4 Jours (Standard)',
        days: [
            { id: 'lundi', name: 'Lundi', focus: 'Pecs & Triceps', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>' },
            { id: 'mardi', name: 'Mardi', focus: 'Dos & Biceps', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>' },
            { id: 'mercredi', name: 'Mercredi', focus: 'Cardio (1 sur 2)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>' },
            { id: 'jeudi', name: 'Jeudi', focus: 'Jambes (Quadri & Ischios)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>' },
            { id: 'vendredi', name: 'Vendredi', focus: 'Full Haut du Corps', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>' }
        ],
        exercises: {
            lundi: [
                { id: 'dc_barre', name: 'Développé Couché Barre', sets: 4, rest: 120 },
                { id: 'di_halteres', name: 'Développé Incliné Haltères', sets: 4, rest: 90 },
                { id: 'pullover_haltere', name: 'Pull-over Haltère', sets: 3, rest: 75 },
                { id: 'dips', name: 'Dips (lestés si possible)', sets: 4, rest: 90 },
                { id: 'skull_crusher', name: 'Barre au Front (Skull Crusher)', sets: 3, rest: 75 }
            ],
            mardi: [
                { id: 'tractions', name: 'Tractions / Traction lestée', sets: 4, rest: 120 },
                { id: 'rowing_barre', name: 'Rowing Barre (penchée)', sets: 4, rest: 120 },
                { id: 'tirage_poitrine', name: 'Tirage Poitrine Barre', sets: 3, rest: 90 },
                { id: 'curl_barre_ez', name: 'Curl Barre EZ', sets: 3, rest: 75 },
                { id: 'curl_marteau', name: 'Curl Marteau Haltères', sets: 3, rest: 60 }
            ],
            mercredi: [
                { id: 'cardio', name: 'Course / Vélo / Elliptique (30-45m)', sets: 1, rest: 0 }
            ],
            jeudi: [
                { id: 'squat_barre', name: 'Squat Barre (Quadriceps)', sets: 4, rest: 150 },
                { id: 'leve_jambe', name: 'Leg Extension Machine', sets: 3, rest: 75 },
                { id: 'fentes_halteres', name: 'Fentes Haltères', sets: 3, rest: 90 },
                { id: 'rdl_halteres', name: 'Soulevé de Terre Jambes Tendues', sets: 3, rest: 120 },
                { id: 'leg_curl', name: 'Leg Curl Assis (Ischios)', sets: 4, rest: 75 }
            ],
            vendredi: [
                { id: 'dev_milit_halteres', name: 'Développé Militaire Haltères', sets: 4, rest: 90 },
                { id: 'elev_lat', name: 'Élévations Latérales Haltères', sets: 3, rest: 60 },
                { id: 'oiseau', name: 'Oiseau / Face Pull', sets: 3, rest: 60 },
                { id: 'tirage_poulie_basse', name: 'Tirage Poulie Basse', sets: 3, rest: 75 },
                { id: 'dev_incline_machine', name: 'Développé Incliné Machine', sets: 4, rest: 90 },
                { id: 'superset_bras', name: 'Superset — Curl/Kickback', sets: 3, rest: 60 }
            ]
        }
    };
}

// Récupère TOUS les programmes (Globaux)
function getMyPrograms() {
    // Migration: si la nouvelle clé globale n'existe pas mais que l'ancienne locale existe
    let programs = JSON.parse(localStorage.getItem('all_custom_programs'));
    if (!programs) {
        // Tentative de récupération des programmes locaux de V2 Alpha
        const oldPrograms = JSON.parse(localStorage.getItem(getKey('my_custom_programs')));
        if (oldPrograms && oldPrograms.length > 0) {
            programs = oldPrograms;
            localStorage.setItem('all_custom_programs', JSON.stringify(programs));
        }
    }

    if (!programs || programs.length === 0) {
        programs = [getDefaultProgram()];
        localStorage.setItem('all_custom_programs', JSON.stringify(programs));
    }
    return programs;
}

// Récupère LE programme actuellement sélectionné
function getActiveProgram() {
    const programs = getMyPrograms();
    let activeId = localStorage.getItem(getKey('active_program_id'));

    // Si aucun sélectionné ou introuvable, on prend le premier
    let active = programs.find(p => p.id === activeId);
    if (!active) {
        active = programs[0];
        localStorage.setItem(getKey('active_program_id'), active.id);
    }
    return active;
}

// Raccourcis dynamiques pour remplacer les anciennes constantes globales
function getProgDays() { return getActiveProgram().days; }
function getProgExo(dayId) { return getActiveProgram().exercises[dayId] || []; }

// =============================================
// PROFIL UTILISATEUR & ISOLATION DONNÉES
// =============================================
let currentUserId = localStorage.getItem('my_user_id') || null;

function getKey(name) {
    return `${currentUserId}_${name}`;
}

function getSavedProfiles() {
    return JSON.parse(localStorage.getItem('all_saved_profiles')) || [];
}

function saveProfile(name, userId) {
    const profiles = getSavedProfiles();
    const existing = profiles.find(p => p.id === userId);
    if (!existing) {
        profiles.push({ id: userId, name: name });
        localStorage.setItem('all_saved_profiles', JSON.stringify(profiles));
    }
}

window.confirmProfile = function (forcedName = null) {
    const input = document.getElementById('profile-name-input');
    const name = forcedName || input?.value.trim() || '';

    if (!name) {
        if (input) {
            input.classList.add('shake');
            setTimeout(() => input.classList.remove('shake'), 400);
        }
        return;
    }

    const userId = name.toLowerCase().replace(/\s+/g, '_');
    localStorage.setItem('my_user_id', userId);
    currentUserId = userId;
    saveProfile(name, userId);

    document.getElementById('profile-overlay').classList.add('hidden');
    initApp();
};

// Appui Entrée sur l'input
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('profile-name-input');
    if (input) input.addEventListener('keydown', e => { if (e.key === 'Enter') window.confirmProfile(); });
});

window.switchProfile = function () {
    // Rend le modal visible
    document.getElementById('profile-overlay').classList.remove('hidden');
    renderProfileModal();
};

function renderProfileModal() {
    const profiles = getSavedProfiles();
    const listContainer = document.getElementById('profile-list');

    if (!listContainer) return;

    if (profiles.length === 0) {
        listContainer.innerHTML = '';
        listContainer.style.display = 'none';
    } else {
        listContainer.style.display = 'grid';
        let html = '';
        profiles.forEach(p => {
            html += `
                <div style="display: flex; gap: 8px; width: 100%;">
                    <button class="profile-btn" style="flex: 1;" onclick="confirmProfile('${p.name.replace(/'/g, "\\'")}')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        ${p.name}
                    </button>
                    <button class="btn-danger" style="padding: 0 16px; border-radius: var(--radius-sm); border: none; background: rgba(255, 23, 68, 0.2); color: var(--danger);" onclick="deleteProfile('${p.id}')" title="Supprimer ce profil">
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            `;
        });
        listContainer.innerHTML = html;
    }
}

window.deleteProfile = function (userId) {
    showConfirm("Êtes-vous sûr de vouloir supprimer définitivement ce profil et TOUTES ses données (programmes, historique, etc.) ?", () => {
        // 1. Supprimer de la liste des profils sauvegardés
        let profiles = getSavedProfiles();
        profiles = profiles.filter(p => p.id !== userId);
        localStorage.setItem('all_saved_profiles', JSON.stringify(profiles));

        // 2. Nettoyer le localStorage des données de cet utilisateur
        const prefix = userId + '_';
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(prefix)) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));

        // 3. Si l'utilisateur supprimé était l'actif, on force la re-sélection
        if (currentUserId === userId) {
            localStorage.removeItem('my_user_id');
            currentUserId = null;
            // Recharger la page pour forcer la re-sélection de profil
            window.location.reload();
            return;
        }

        // 4. Rafraîchir l'affichage du modal
        if (profiles.length === 0) {
            window.location.reload();
        } else {
            renderProfileModal();
        }
    });
}
// =============================================
// DÉVERROUILLAGE AUDIO IOS
// =============================================
let audioCtx = null;
let audioUnlocked = false;

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

function unlockAudio() {
    if (audioUnlocked) return;
    const ctx = getAudioContext();
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
    let profileBtn = document.getElementById('profile-switch-btn');
    const btnHtml = `<span>${currentUserId.replace(/_/g, ' ')}</span> <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;

    if (!profileBtn) {
        profileBtn = document.createElement('button');
        profileBtn.id = 'profile-switch-btn';
        profileBtn.className = 'profile-switch-btn';
        profileBtn.title = 'Changer de profil';
        profileBtn.onclick = switchProfile;
        document.querySelector('.header-content').appendChild(profileBtn);
    }
    profileBtn.innerHTML = btnHtml;

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
    // Si on a déjà un profil, on initie l'app en arrière plan pour être prêt (au cas où il a rechargé)
    const profiles = getSavedProfiles();
    // Le profile existe-t-il dans notre liste master ? Si non, on l'ajoute.
    const exists = profiles.find(p => p.id === currentUserId);
    if (!exists) saveProfile(currentUserId.replace(/_/g, ' '), currentUserId);

    initApp();
} else {
    // Afficher l'écran de profil
    document.getElementById('profile-overlay').classList.remove('hidden');
    renderProfileModal();
    const input = document.getElementById('profile-name-input');
    if (input) setTimeout(() => input.focus(), 100);
}

// Navigation Logic
function switchView(view, param = null) {
    currentView = view;
    navBtns.forEach(b => b.classList.remove('active'));

    if (view === 'home' || view === 'history') {
        const btn = document.querySelector(`.nav-btn[data-view="${view}"]`);
        if (btn) btn.classList.add('active');
        backBtn.classList.add('hidden');
        headerSubtitle.textContent = view === 'home' ? 'Progression & Hypertrophie' : 'Historique des Séances';
        document.querySelector('.header-content').style.marginLeft = '0';
    } else {
        backBtn.classList.remove('hidden');
        document.querySelector('.header-content').style.marginLeft = '0';
    }

    mainContent.innerHTML = '';

    if (view === 'home') {
        renderHome();
    } else if (view === 'history') {
        renderHistory();
    } else if (view === 'workout') {
        document.querySelector('.nav-btn[data-view="home"]').classList.add('active');
    } else if (view === 'programs') {
        headerSubtitle.textContent = 'Gestion des Programmes';
        // Bouton retour depuis les programmes -> Home
        backBtn.onclick = () => switchView('home');
        renderProgramsList();
    } else if (view === 'editor') {
        headerSubtitle.textContent = 'Éditeur de Programme';
        // Bouton retour depuis l'éditeur -> Programmes
        backBtn.onclick = () => switchView('programs');
        renderProgramEditor(param);
    }

    // Réinitialiser le comportement du backBtn si on revient sur home/history (sûreté)
    if (view === 'home' || view === 'history') {
        backBtn.onclick = () => switchView('home');
    }
}

// Renders
function estimateDay(dayId) {
    const exos = getProgExo(dayId);
    if (!exos || exos.length === 0) return '0 min'; // Changed from 0 to '0 min' for consistency with return type
    let totalSec = 0;
    exos.forEach(ex => {
        const sets = ex.sets || 3;
        const rest = ex.rest || 60;
        const workPerSet = 40;
        totalSec += sets * (workPerSet + rest);
    });
    // +10% pour transitions/installation
    totalSec = Math.round(totalSec * 1.1);
    const min = Math.round(totalSec / 60);
    return `~${min} min`;
}

function renderHome() {
    let html = '';
    const progDays = getProgDays();

    html += `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding: 12px; background: var(--surface-light); border-radius: var(--radius-md); border: 1px solid var(--border);">
            <div>
                <h3 style="color: var(--primary); font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">Programme Actif</h3>
                <p style="color: var(--text); font-size: 16px; margin-top: 4px; font-weight: 600;">${getActiveProgram().name}</p>
            </div>
            <button onclick="switchView('programs')" style="background: none; border: none; color: var(--text-sec); cursor: pointer; padding: 8px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.2s; background: var(--bg);">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
            </button>
        </div>`;

    progDays.forEach(day => {
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

// =============================================
// GESTIONNAIRE DE PROGRAMMES (Liste)
// =============================================

window.selectProgram = function (id) {
    localStorage.setItem(getKey('active_program_id'), id);
    showToast();
    switchView('home');
};

window.deleteProgram = function (id) {
    if (confirm("Supprimer définitivement ce programme pour TOUS LES UTILISATEURS de cet appareil ?")) {
        let programs = getMyPrograms();
        programs = programs.filter(p => p.id !== id);
        localStorage.setItem('all_custom_programs', JSON.stringify(programs));

        // Si on a supprimé le programme actif, on bascule sur le premier dispo
        const activeId = localStorage.getItem(getKey('active_program_id'));
        if (activeId === id && programs.length > 0) {
            localStorage.setItem(getKey('active_program_id'), programs[0].id);
        }
        renderProgramsList();
    }
};

function renderProgramsList() {
    const programs = getMyPrograms();
    const activeId = getActiveProgram().id;
    let html = '<div class="programs-list-container">';

    programs.forEach(p => {
        const isActive = p.id === activeId;
        html += `
            <div class="day-card" style="border: ${isActive ? '2px solid var(--primary)' : '1px solid var(--border)'}; flex-direction: column; align-items: flex-start; gap: 12px; cursor: default; padding-bottom: 16px;">
                <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div class="day-icon">${isActive ? '⭐' : '📄'}</div>
                        <h3 style="font-size: 18px;">${p.name}</h3>
                    </div>
                </div>
                <div style="display: flex; gap: 10px; width: 100%; margin-top: 8px;">
                    ${!isActive ? `<button class="btn-primary" style="flex: 1; padding: 12px; font-size: 14px; border-radius: var(--radius-sm);" onclick="selectProgram('${p.id}')">Activer</button>` : `<button class="btn-primary" style="flex: 1; padding: 12px; font-size: 14px; border-radius: var(--radius-sm); opacity: 0.5; cursor: default;">Actif</button>`}
                    
                    <button class="btn-secondary" style="flex: 1; padding: 12px; font-size: 14px; border-radius: var(--radius-sm); background: var(--surface); color: var(--text); border: 1px solid var(--border);" onclick="switchView('editor', '${p.id}')">Éditer</button>
                    
                    ${programs.length > 1 ? `<button class="btn-danger" style="padding: 12px; border-radius: var(--radius-sm); border: none; background: var(--danger); color: white;" onclick="deleteProgram('${p.id}')">
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>` : ''}
                </div>
            </div>
        `;
    });

    html += `
        <button class="btn-add-set" style="margin-top: 24px;" onclick="switchView('editor', 'new')">+ Créer un nouveau programme</button>
    </div>`;

    mainContent.innerHTML = html;
}

// =============================================
// ÉDITEUR DE PROGRAMME
// =============================================

let editingProgram = null;

function renderProgramEditor(progId) {
    if (progId === 'new') {
        editingProgram = {
            id: 'prog_' + Date.now(),
            name: 'Nouveau Programme',
            days: [],
            exercises: {}
        };
    } else if (!editingProgram || editingProgram.id !== progId) {
        // Deep copy to prevent modifying active program directly
        const prog = getMyPrograms().find(p => p.id === progId);
        editingProgram = JSON.parse(JSON.stringify(prog));
    }

    const safeQuote = (str) => (str || '').toString().replace(/"/g, '&quot;');

    let html = `
        <div style="margin-bottom: 24px;">
            <label style="font-size: 13px; color: var(--text-sec); text-transform: uppercase; font-weight: 800; letter-spacing: 1px;">Nom du Programme</label>
            <input type="text" value="${safeQuote(editingProgram.name)}" placeholder="Ex: PPL 3 Jours" 
                   onchange="editingProgram.name = this.value" 
                   style="width: 100%; padding: 14px; margin-top: 8px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: var(--surface-light); color: var(--text); font-size: 16px; font-weight: 600;">
        </div>
        <div class="editor-days-list" style="display: flex; flex-direction: column; gap: 24px;">
    `;

    editingProgram.days.forEach((day, dIdx) => {
        html += `
            <div style="background: var(--surface-light); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 16px;">
                <div style="display: flex; justify-content: space-between; gap: 12px; margin-bottom: 12px;">
                    <div style="flex: 1;">
                        <input type="text" value="${safeQuote(day.name)}" placeholder="Nom (ex: Lundi, Push)" 
                               onchange="editingProgram.days[${dIdx}].name = this.value"
                               style="width: 100%; padding: 10px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: var(--bg); color: var(--text); font-size: 15px; font-weight: bold;">
                    </div>
                    <button class="btn-danger" style="padding: 0 16px; border-radius: var(--radius-sm); border: none; background: var(--danger); color: white;" onclick="editorRemoveDay(${dIdx})">
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
                <input type="text" value="${safeQuote(day.focus)}" placeholder="Focus (ex: Pecs & Triceps)" 
                       onchange="editingProgram.days[${dIdx}].focus = this.value"
                       style="width: 100%; padding: 10px; margin-bottom: 16px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: var(--bg); color: var(--text); font-size: 14px;">
                
                <h4 style="font-size: 13px; color: var(--text-sec); margin-bottom: 8px; text-transform: uppercase;">Exercices</h4>
                <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;">
        `;

        const exos = editingProgram.exercises[day.id] || [];
        exos.forEach((ex, eIdx) => {
            html += `
                <div style="display: flex; flex-direction: column; gap: 8px; background: var(--bg); padding: 12px; border-radius: var(--radius-sm); border: 1px solid rgba(255,255,255,0.05);">
                    <div style="display: flex; gap: 8px;">
                        <input type="text" value="${safeQuote(ex.name)}" placeholder="Nom de l'exercice" 
                               onchange="editingProgram.exercises['${day.id}'][${eIdx}].name = this.value"
                               style="flex: 1; padding: 10px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: var(--surface-light); color: var(--text); font-size: 14px; font-weight: 600;">
                        <button class="btn-danger" style="padding: 0 12px; border-radius: var(--radius-sm); border: none; background: rgba(255, 23, 68, 0.2); color: var(--danger);" onclick="editorRemoveEx('${day.id}', ${eIdx})">X</button>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <div style="flex: 1; display:flex; align-items: center; background: var(--surface-light); border-radius: var(--radius-sm); padding: 0 10px;">
                            <span style="font-size: 12px; color: var(--text-sec); margin-right: 8px;">Séries</span>
                            <input type="number" value="${ex.sets}" 
                                   onchange="editingProgram.exercises['${day.id}'][${eIdx}].sets = parseInt(this.value) || 3"
                                   style="width: 100%; padding: 10px 0; border: none; background: transparent; color: var(--text); outline: none; text-align: right; font-size: 15px; font-weight: bold;">
                        </div>
                        <div style="flex: 1; display:flex; align-items: center; background: var(--surface-light); border-radius: var(--radius-sm); padding: 0 10px;">
                            <span style="font-size: 12px; color: var(--text-sec); margin-right: 8px;">Repos (s)</span>
                            <input type="number" value="${ex.rest}" step="15"
                                   onchange="editingProgram.exercises['${day.id}'][${eIdx}].rest = parseInt(this.value) || 60"
                                   style="width: 100%; padding: 10px 0; border: none; background: transparent; color: var(--text); outline: none; text-align: right; font-size: 15px; font-weight: bold;">
                        </div>
                    </div>
                </div>
            `;
        });

        html += `
                </div>
                <button class="btn-secondary" style="width: 100%; padding: 10px; font-size: 14px; border-radius: var(--radius-sm); border: 1px dashed var(--text-sec); background: transparent; color: var(--text-sec);" onclick="editorAddEx('${day.id}')">+ Ajouter exercice</button>
            </div>
        `;
    });

    html += `
        </div>
        <button class="btn-add-set" style="margin-top: 24px; margin-bottom: 24px;" onclick="editorAddDay()">+ Ajouter un jour</button>
        
        <div style="position: sticky; bottom: 20px; padding-top: 20px;">
            <button class="btn-primary" style="width: 100%; padding: 16px; font-size: 16px; font-weight: 800; border-radius: var(--radius-md); box-shadow: var(--shadow);" onclick="saveEditedProgram()">💾 Enregistrer le Programme</button>
        </div>
        <div style="height: 60px;"></div> <!-- Espace pour s'assurer que le bas scrolle assez -->
    `;

    mainContent.innerHTML = html;
}

window.editorAddDay = function () {
    const newId = 'day_' + Date.now();
    editingProgram.days.push({
        id: newId,
        name: '',
        focus: '',
        icon: '💪'
    });
    editingProgram.exercises[newId] = [];
    renderProgramEditor(editingProgram.id);
};

window.editorRemoveDay = function (index) {
    if (confirm('Supprimer ce jour et tous ses exercices ?')) {
        const dayId = editingProgram.days[index].id;
        editingProgram.days.splice(index, 1);
        delete editingProgram.exercises[dayId];
        renderProgramEditor(editingProgram.id);
    }
};

window.editorAddEx = function (dayId) {
    if (!editingProgram.exercises[dayId]) editingProgram.exercises[dayId] = [];
    editingProgram.exercises[dayId].push({
        id: 'ex_' + Date.now(),
        name: '',
        sets: 3,
        rest: 90
    });
    renderProgramEditor(editingProgram.id);
};

window.editorRemoveEx = function (dayId, exIndex) {
    editingProgram.exercises[dayId].splice(exIndex, 1);
    renderProgramEditor(editingProgram.id);
};

window.saveEditedProgram = function () {
    if (!editingProgram.name.trim()) {
        alert("Veuillez donner un nom au programme.");
        return;
    }
    if (editingProgram.days.length === 0) {
        alert("Le programme doit contenir au moins un jour d'entraînement.");
        return;
    }

    let programs = getMyPrograms();
    const existingIndex = programs.findIndex(p => p.id === editingProgram.id);

    if (existingIndex >= 0) {
        programs[existingIndex] = editingProgram;
    } else {
        programs.push(editingProgram);
    }

    // Sauvegarde GLOBALE
    localStorage.setItem('all_custom_programs', JSON.stringify(programs));
    editingProgram = null;
    showToast();
    switchView('programs');
};

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
    activeWorkoutDay = getProgDays().find(d => d.id === dayId);
    currentWorkoutData = {};

    headerSubtitle.textContent = `${activeWorkoutDay.name} - ${activeWorkoutDay.focus}`;
    switchView('workout');

    const exercises = getProgExo(dayId) || [];

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
        const targetSets = ex.sets ?? 3;
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
        // Retrouver l'exercice dans le programme pour son rest
        const exoDef = getProgExo(activeWorkoutDay.id).find(e => e.id === exId);
        const rest = exoDef?.rest ?? 90; // Fallback 90s par défaut
        if (rest > 0) startTimer(rest);
    }
};

window.deleteSet = function (exId, setIndex) {
    if (currentWorkoutData[exId].length > 1) {
        currentWorkoutData[exId].splice(setIndex, 1);
        renderSets(exId);
        saveDraft();
    } else {
        // Optionnel : avertir qu'on ne peut pas supprimer la dernière série
        alert("Impossible de supprimer la dernière série. Laissez-la vide si vous ne la faites pas.");
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
                <button class="btn-remove-set" onclick="deleteSet('${exId}', ${i})" title="Supprimer cette série">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
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
                // Essayer de trouver le nom de l'exercice (peut-être obsolète si le prog a changé, mais ok)
                let exName = exId;
                const activeProgExos = getProgExo(session.dayId) || [];
                const foundEx = activeProgExos.find(e => e.id === exId);
                if (foundEx) exName = foundEx.name;

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
        const ctx = getAudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        // Son de notification doux (Sinus de A5 descendant à A4)
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3);

        gainNode.gain.setValueAtTime(1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.3);
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

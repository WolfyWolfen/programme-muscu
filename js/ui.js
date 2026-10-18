// js/ui.js
const mainContent = document.getElementById('main-content');
const backBtn = document.getElementById('back-btn');
const headerSubtitle = document.getElementById('header-subtitle');
const navBtns = document.querySelectorAll('.nav-btn');

/**
 * Change la vue principale de l'application (Programme, Historique, Stats, Éditeur).
 * @param {string} view - Le nom de la vue cible (ex: 'home', 'history', 'stats', 'programs').
 * @param {string|null} param - Un paramètre optionnel (ex: l'id du programme à éditer).
 */
function switchView(view, param = null) {
    if (currentView === 'workout' && view !== 'workout') {
        if (typeof resetSessionTimer === 'function') resetSessionTimer();
        if (typeof setWakeLock === 'function') setWakeLock(false);
    }
    currentView = view;
    navBtns.forEach(b => b.classList.remove('active'));

    if (view === 'home' || view === 'history' || view === 'stats') {
        const btn = document.querySelector(`.nav-btn[data-view="${view}"]`);
        if (btn) btn.classList.add('active');
        backBtn.classList.add('hidden');
        
        if (view === 'home') headerSubtitle.textContent = 'Progression & Hypertrophie';
        else if (view === 'history') headerSubtitle.textContent = 'Historique des Séances';
        else if (view === 'stats') headerSubtitle.textContent = 'Statistiques';
        
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
    } else if (view === 'stats') {
        renderStats();
    } else if (view === 'workout') {
        document.querySelector('.nav-btn[data-view="home"]').classList.add('active');
    } else if (view === 'programs') {
        headerSubtitle.textContent = 'Gestion des Programmes';
        backBtn.onclick = () => switchView('home');
        renderProgramsList();
    } else if (view === 'editor') {
        headerSubtitle.textContent = 'Éditeur de Programme';
        backBtn.onclick = () => switchView('programs');
        renderProgramEditor(param);
    }

    if (view === 'home' || view === 'history' || view === 'stats') {
        backBtn.onclick = () => switchView('home');
    }
}

/**
 * Estime la durée d'une séance (en minutes) en fonction du nombre de séries et du temps de repos.
 * @param {string} dayId - L'identifiant de la journée.
 * @returns {string} Chaîne formatée (ex: "~45 min").
 */
function estimateDay(dayId) {
    const exos = getProgExo(dayId);
    if (!exos || exos.length === 0) return '0 min';
    let totalSec = 0;
    exos.forEach(ex => {
        const sets = ex.sets || 3;
        const rest = ex.rest || 60;
        const workPerSet = 40;
        totalSec += sets * (workPerSet + rest);
    });
    totalSec = Math.round(totalSec * 1.1);
    const min = Math.round(totalSec / 60);
    return `~${min} min`;
}

/**
 * Renvoie une chaîne indiquant quand une journée a été effectuée pour la dernière fois.
 * @param {string} dayId - L'identifiant de la journée
 * @returns {string|null} Texte formaté (ex: "Aujourd'hui", "Hier", "Il y a 4j")
 */
function getLastDoneText(dayId) {
    if (!historyData || historyData.length === 0) return null;
    const matches = historyData.filter(h => h.dayId === dayId).sort((a, b) => b.date - a.date);
    if (matches.length === 0) return null;
    const lastDate = new Date(matches[0].date);
    const now = new Date();
    lastDate.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    const diffDays = Math.round((now - lastDate) / (24 * 3600 * 1000));
    if (diffDays <= 0) return "Fait aujourd'hui";
    if (diffDays === 1) return "Fait hier";
    return `Il y a ${diffDays} j`;
}

/**
 * Construit et affiche la vue "Accueil" (Liste des jours d'entraînement du programme actif).
 */
function renderHome() {
    let html = '';
    const progDays = getProgDays();
    const activeProg = getActiveProgram();

    html += `
        <div class="active-prog-banner">
            <div>
                <div class="active-prog-label">
                    <span class="pulse-dot"></span> Programme Actif
                </div>
                <p class="active-prog-name">${escapeHTML(activeProg.name)}</p>
            </div>
            <button onclick="switchView('programs')" class="btn-gear" title="Gérer les programmes">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
            </button>
        </div>`;

    progDays.forEach((day, idx) => {
        const estimated = estimateDay(day.id);
        const lastDone = getLastDoneText(day.id);
        const exCount = (getProgExo(day.id) || []).length;
        html += `
            <div class="day-card stagger-item" style="animation-delay: ${idx * 45}ms;" onclick="startWorkout('${day.id}')">
                <div class="day-icon">${day.icon}</div>
                <div class="day-info">
                    <h2>${escapeHTML(day.name)}</h2>
                    <p>${escapeHTML(day.focus)}</p>
                    <div class="day-badges">
                        <span class="day-duration">
                            <svg viewBox="0 0 24 24" width="11" height="11" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                            ${estimated}
                        </span>
                        <span class="day-ex-count">${exCount} exo${exCount > 1 ? 's' : ''}</span>
                        ${lastDone ? `<span class="day-last-done">${lastDone}</span>` : ''}
                    </div>
                </div>
                <div class="day-chevron">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>
            </div>
        `;
    });

    html += `<div class="app-version-footer" onclick="forceAppUpdate()" title="Toucher pour vérifier les mises à jour" style="cursor: pointer;">Mon Programme PWA — ${APP_VERSION} ↻</div>`;
    mainContent.innerHTML = html;
}

/**
 * Force la suppression des caches du Service Worker et recharge l'application depuis le serveur.
 */
window.forceAppUpdate = async function() {
    if (typeof showToast === 'function') showToast('Recherche de mise à jour...');
    try {
        if ('serviceWorker' in navigator) {
            const regs = await navigator.serviceWorker.getRegistrations();
            for (const reg of regs) {
                await reg.unregister();
            }
        }
        if ('caches' in window) {
            const keys = await caches.keys();
            for (const key of keys) {
                await caches.delete(key);
            }
        }
    } catch (e) {
        console.warn(e);
    }
    window.location.reload();
};

/**
 * Met à jour la modale de sélection de profil (Utilisateurs et Export/Import JSON).
 */
function renderProfileModal() {
    const profiles = getSavedProfiles();
    const listContainer = document.getElementById('profile-list');
    const closeBtn = document.getElementById('profile-close-btn');

    if (closeBtn) {
        if (currentUserId) closeBtn.classList.remove('hidden');
        else closeBtn.classList.add('hidden');
    }

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
                        ${escapeHTML(p.name)}
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

/**
 * Définit un nouveau programme entier comme cible en écrasant l'actif.
 * @param {string} id - L'ID du programme
 */
window.selectProgram = function (id) {
    localStorage.setItem(getKey('active_program_id'), id);
    showToast();
    switchView('home');
};

/**
 * Supprime un programme de la bibliothèque locale.
 * @param {string} id - L'ID du programme 
 */
window.deleteProgram = function (id) {
    showConfirm("Supprimer définitivement ce programme pour TOUS LES UTILISATEURS de cet appareil ?", () => {
        let programs = getMyPrograms();
        programs = programs.filter(p => p.id !== id);
        localStorage.setItem('all_custom_programs', JSON.stringify(programs));

        const activeId = localStorage.getItem(getKey('active_program_id'));
        if (activeId === id && programs.length > 0) {
            localStorage.setItem(getKey('active_program_id'), programs[0].id);
        }
        renderProgramsList();
    });
};

/**
 * Affiche la liste globale de tous les programmes créés.
 */
function renderProgramsList() {
    const programs = getMyPrograms();
    const activeId = getActiveProgram().id;
    let html = '<div class="programs-list-container">';

    const starSvg = '<svg viewBox="0 0 24 24" width="24" height="24" stroke="var(--primary)" stroke-width="2" fill="rgba(0, 229, 255, 0.2)" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';
    const docSvg = '<svg viewBox="0 0 24 24" width="24" height="24" stroke="var(--text-sec)" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>';
    const copySvg = '<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
    const shareSvg = '<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>';

    programs.forEach((p, idx) => {
        const isActive = p.id === activeId;
        html += `
            <div class="day-card stagger-item" style="animation-delay: ${idx * 45}ms; border: ${isActive ? '1.5px solid var(--primary)' : '1px solid var(--border)'}; flex-direction: column; align-items: flex-start; gap: 12px; cursor: default; padding-bottom: 16px;">
                <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div class="day-icon" style="width: 48px; height: 48px; margin-right: 0;">${isActive ? starSvg : docSvg}</div>
                        <div>
                            <h3 style="font-size: 17px; font-weight: 700;">${escapeHTML(p.name)}</h3>
                            <span style="font-size: 12px; color: var(--text-sec);">${p.days.length} jour${p.days.length > 1 ? 's' : ''}</span>
                        </div>
                    </div>
                    <div style="display: flex; gap: 6px;">
                        <button class="btn-icon-action" onclick="duplicateProgram('${p.id}')" title="Dupliquer ce programme">${copySvg}</button>
                        <button class="btn-icon-action" onclick="exportSingleProgram('${p.id}')" title="Partager / Exporter ce programme (JSON)">${shareSvg}</button>
                    </div>
                </div>
                <div style="display: flex; gap: 10px; width: 100%; margin-top: 4px;">
                    ${!isActive ? `<button class="btn-primary" style="flex: 1; padding: 12px; font-size: 14px; border-radius: var(--radius-sm);" onclick="selectProgram('${p.id}')">Activer</button>` : `<button class="btn-primary" style="flex: 1; padding: 12px; font-size: 14px; border-radius: var(--radius-sm); opacity: 0.55; cursor: default;">✓ Actif</button>`}
                    
                    <button class="btn-secondary" style="flex: 1; padding: 12px; font-size: 14px; border-radius: var(--radius-sm); background: var(--surface-light); color: var(--text); border: 1px solid var(--border); font-weight: 600; cursor: pointer;" onclick="switchView('editor', '${p.id}')">Éditer</button>
                    
                    ${programs.length > 1 ? `<button class="btn-danger" style="padding: 12px; border-radius: var(--radius-sm); border: 1px solid rgba(255, 23, 68, 0.3); background: rgba(255, 23, 68, 0.15); color: var(--danger); cursor: pointer;" onclick="deleteProgram('${p.id}')">
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
        <button class="btn-add-set" style="margin-top: 16px;" onclick="switchView('editor', 'new')">+ Créer un nouveau programme</button>
        <button class="btn-add-set" style="margin-top: 10px; border-style: solid;" onclick="document.getElementById('import-prog-input').click()">Importer un programme partagé (.json)</button>
        <input type="file" id="import-prog-input" accept=".json" style="display: none;" onchange="importSingleProgram(event)">
    </div>`;

    mainContent.innerHTML = html;
}

/**
 * Résout le nom d'un exercice à partir de la séance sauvegardée ou de tous les programmes existants.
 * @param {Object} session - La séance d'historique
 * @param {string} exId - L'ID de l'exercice
 * @returns {string} Le nom de l'exercice
 */
function resolveExerciseName(session, exId) {
    if (session && session.exerciseNames && session.exerciseNames[exId]) {
        return session.exerciseNames[exId];
    }
    const allPrograms = getMyPrograms();
    for (const prog of allPrograms) {
        for (const exList of Object.values(prog.exercises || {})) {
            const found = exList.find(e => e.id === exId);
            if (found && found.name) return found.name;
        }
    }
    return exId;
}

/**
 * Affiche l'historique complet des entraînements (séance par séance).
 */
function renderHistory() {
    if (historyData.length === 0) {
        mainContent.innerHTML = '<div style="text-align:center; margin-top: 40px; color: var(--text-sec)">Aucune séance enregistrée pour le moment.</div>';
        return;
    }

    const sortedHistory = [...historyData].sort((a, b) => b.date - a.date);
    mainContent.innerHTML = '';
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
                const exName = resolveExerciseName(session, exId);

                detailsHtml += `<div class="history-ex-title">
                                    <span>${escapeHTML(exName)}</span>
                                    <button class="btn-delete-history btn-delete-ex" onclick="deleteHistoryExercise(${session.id}, '${exId}')" title="Supprimer cet exercice">${deleteIcon}</button>
                                </div><ul>`;

                sets.forEach((s, idx) => {
                    if (s.checked) {
                        totalSets++;
                        if (s.kg && s.reps) totalVol += (parseFloat(s.kg) * parseInt(s.reps));
                        const oneRm = calcOneRM(s.kg, s.reps);
                        const oneRmTag = oneRm > 0 ? `<span class="history-1rm-tag">1RM ~${oneRm}kg</span>` : '';
                        detailsHtml += `<li>Série ${idx + 1} : ${escapeHTML(s.kg) || 0} kg × ${escapeHTML(s.reps) || 0} reps ${oneRmTag} <button class="btn-delete-history" onclick="deleteHistorySet(${session.id}, '${exId}', ${idx})" title="Supprimer cette série">${deleteIcon}</button></li>`;
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
            <div class="history-date">${escapeHTML(dateStr)}</div>
            <div class="history-title">${escapeHTML(session.dayName)}</div>
            <div class="history-stats">
                Séries validées : <b>${totalSets}</b><br>
                Volume total : ${totalVol > 0 ? `<b>${Math.round(totalVol)} kg</b>` : '-'}
                ${durationStr ? `<br>Durée : <b>${durationStr}</b>` : ''}
            </div>
            ${detailsHtml}
        `;
        container.appendChild(card);
    });

    mainContent.appendChild(container);
}

/**
 * Calcule le nombre de semaines consécutives avec au moins 1 entraînement.
 * @returns {number} Nombre de semaines consécutives
 */
function calculateWeeklyStreak() {
    if (!historyData || historyData.length === 0) return 0;
    const getMonday = (ts) => {
        const d = new Date(ts);
        d.setHours(0, 0, 0, 0);
        const day = d.getDay() || 7;
        d.setDate(d.getDate() - day + 1);
        return d.getTime();
    };
    const activeWeeks = new Set(historyData.map(s => getMonday(s.date)));
    const ONE_WEEK = 7 * 24 * 3600 * 1000;
    let checkMonday = getMonday(Date.now());
    if (!activeWeeks.has(checkMonday)) {
        // Si pas encore entraîné cette semaine, on vérifie depuis la semaine dernière
        checkMonday -= ONE_WEEK;
    }
    let streak = 0;
    while (activeWeeks.has(checkMonday)) {
        streak++;
        checkMonday -= ONE_WEEK;
    }
    return streak;
}

/**
 * Met à jour dynamiquement le graphique de progression d'un exercice spécifique dans l'onglet Stats.
 * @param {string} exId - L'ID de l'exercice sélectionné
 */
window.updateExerciseChart = function(exId) {
    const container = document.getElementById('ex-chart-wrapper');
    if (!container) return;

    const sortedHistory = [...historyData].sort((a, b) => a.date - b.date);
    const points = [];

    sortedHistory.forEach(session => {
        const sets = session.data && session.data[exId];
        if (!sets) return;
        let maxKg = 0;
        let max1RM = 0;
        sets.forEach(s => {
            if (s.checked && s.kg && s.reps) {
                const w = parseFloat(s.kg);
                const rm = calcOneRM(w, s.reps);
                if (w > maxKg) maxKg = w;
                if (rm > max1RM) max1RM = rm;
            }
        });
        if (maxKg > 0) {
            const dateObj = new Date(session.date);
            const day = String(dateObj.getDate()).padStart(2, '0');
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            points.push({ date: `${day}/${month}`, maxKg, max1RM });
        }
    });

    if (points.length === 0) {
        container.innerHTML = '<div style="font-size: 13px; color: var(--text-sec); padding: 20px 0;">Aucune charge enregistrée pour cet exercice.</div>';
        return;
    }

    const recent = points.slice(-10);
    const maxVal = Math.max(...recent.map(p => p.max1RM), 1);
    const MAX_BAR_PX = 90;

    let barsHtml = '';
    recent.forEach(p => {
        const hPx = Math.max(Math.round((p.max1RM / maxVal) * MAX_BAR_PX), 4);
        barsHtml += `
            <div class="chart-bar-wrapper">
                <span class="chart-value">${p.maxKg}kg</span>
                <div class="chart-bar" style="height: ${hPx}px; background: linear-gradient(0deg, rgba(179, 136, 255, 0.2), var(--secondary));"></div>
                <div style="display: flex; flex-direction: column; align-items: center; margin-top: 8px;">
                    <span class="chart-label" style="margin-top: 0;">${p.date}</span>
                    <span class="chart-label" style="margin-top: 2px; font-size: 9px; color: var(--secondary);">1RM ${p.max1RM}</span>
                </div>
            </div>
        `;
    });

    const bestOverall = Math.max(...points.map(p => p.maxKg));
    const best1RMOverall = Math.max(...points.map(p => p.max1RM));

    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; font-size: 12px; color: var(--text-sec); margin-bottom: 8px;">
            <span>Record Charge : <b style="color: var(--text);">${bestOverall} kg</b></span>
            <span>Record 1RM estimé : <b style="color: var(--secondary);">${best1RMOverall} kg</b></span>
        </div>
        <div class="chart-container">${barsHtml}</div>
    `;
};

/**
 * Affiche l'onglet Statistiques, incluant le volume cumulé, l'assiduité 28j, le graphique global et le suivi par exercice.
 */
function renderStats() {
    if (historyData.length === 0) {
        mainContent.innerHTML = '<div style="text-align:center; margin-top: 40px; color: var(--text-sec)">Aucune donnée disponible pour le moment. Terminez une séance pour débloquer cet onglet !</div>';
        return;
    }

    let totalVolume = 0;
    let totalWorkouts = historyData.length;
    const streakWeeks = calculateWeeklyStreak();

    const sortedHistory = [...historyData].sort((a, b) => a.date - b.date); 
    
    const sessionsVolume = sortedHistory.map(session => {
        let vol = 0;
        Object.values(session.data).forEach(sets => {
            sets.forEach(s => {
                if (s.checked && s.kg && s.reps) vol += (parseFloat(s.kg) * parseInt(s.reps));
            });
        });
        totalVolume += vol;
        const dateObj = new Date(session.date);
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const dayStr = dateObj.toLocaleDateString('fr-FR', { weekday: 'short' }).replace('.', '').toUpperCase();
        return {
            date: `${day}/${month}`,
            dayStr: dayStr,
            vol: Math.round(vol)
        };
    });

    // Heatmap des 28 derniers jours
    const workoutDaysSet = new Set(
        historyData.map(s => {
            const d = new Date(s.date);
            return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        })
    );
    let heatmapHtml = '<div class="heatmap-grid">';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 27; i >= 0; i--) {
        const d = new Date(today.getTime() - i * 24 * 3600 * 1000);
        const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        const active = workoutDaysSet.has(key);
        const label = d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
        heatmapHtml += `<div class="heatmap-cell ${active ? 'active' : ''}" title="${label}">${d.getDate()}</div>`;
    }
    heatmapHtml += '</div>';

    // 10 Dernières séances pour le graph de volume
    const recentSessions = sessionsVolume.slice(-10);
    const maxVol = Math.max(...recentSessions.map(s => s.vol), 1); 
    const MAX_BAR_PX = 90;

    let chartHtml = '';
    recentSessions.forEach(s => {
        const hPx = Math.max(Math.round((s.vol / maxVol) * MAX_BAR_PX), 4);
        chartHtml += `
            <div class="chart-bar-wrapper">
                <span class="chart-value">${s.vol > 0 ? (s.vol >= 1000 ? (s.vol/1000).toFixed(1) + 'k' : s.vol) : ''}</span>
                <div class="chart-bar" style="height: ${hPx}px;"></div>
                <div style="display: flex; flex-direction: column; align-items: center; margin-top: 8px;">
                    <span class="chart-label" style="margin-top: 0;">${s.date}</span>
                    <span class="chart-label" style="margin-top: 2px; font-weight: 600; font-size: 9px; opacity: 0.8;">${s.dayStr}</span>
                </div>
            </div>
        `;
    });

    // Liste de tous les exercices pratiqués dans l'historique pour le sélecteur
    const practicedExMap = new Map();
    sortedHistory.forEach(session => {
        Object.entries(session.data || {}).forEach(([exId, sets]) => {
            if (sets.some(s => s.checked && s.kg)) {
                practicedExMap.set(exId, resolveExerciseName(session, exId));
            }
        });
    });

    let exOptionsHtml = '';
    let firstExId = null;
    practicedExMap.forEach((name, id) => {
        if (!firstExId) firstExId = id;
        exOptionsHtml += `<option value="${escapeHTML(id)}">${escapeHTML(name)}</option>`;
    });

    mainContent.innerHTML = `
        <div class="stats-container">
            <h2 style="font-size: 20px; color: var(--text); display: flex; align-items: center; gap: 8px;">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="var(--primary)" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
                Impact Global
            </h2>
            <div style="display: flex; gap: 12px;">
                <div class="stat-card" style="flex: 1; padding: 12px;">
                    <div style="font-size: 12px; color: var(--text-sec);">Séances</div>
                    <div class="stat-number" style="font-size: 26px;">${totalWorkouts}</div>
                </div>
                <div class="stat-card" style="flex: 1; padding: 12px;">
                    <div style="font-size: 12px; color: var(--text-sec);">Série (Streak)</div>
                    <div class="stat-number" style="font-size: 26px;">🔥 ${streakWeeks}<span style="font-size: 12px"> sem</span></div>
                </div>
                <div class="stat-card" style="flex: 1.2; padding: 12px;">
                    <div style="font-size: 12px; color: var(--text-sec);">Volume total</div>
                    <div class="stat-number" style="font-size: 20px;">${Math.round(totalVolume).toLocaleString('fr-FR')} <span style="font-size: 12px">kg</span></div>
                </div>
            </div>

            <div class="stat-card">
                <h3 style="font-size: 14px; text-align: left; margin-bottom: 10px; color: var(--text-sec);">Assiduité (28 derniers jours)</h3>
                ${heatmapHtml}
            </div>
            
            ${firstExId ? `
            <div class="stat-card">
                <h3 style="font-size: 14px; text-align: left; margin-bottom: 10px; color: var(--text-sec);">Progression par Exercice (Charge & 1RM)</h3>
                <select class="stats-ex-select" onchange="updateExerciseChart(this.value)">
                    ${exOptionsHtml}
                </select>
                <div id="ex-chart-wrapper"></div>
            </div>
            ` : ''}

            <div class="stat-card">
                <h3 style="font-size: 14px; text-align: left; margin-bottom: 8px; color: var(--text-sec);">Volume global (10 dernières séances)</h3>
                <div class="chart-container">
                    ${chartHtml}
                </div>
            </div>
        </div>
    `;

    if (firstExId) {
        updateExerciseChart(firstExId);
    }
}

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

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
 * Construit et affiche la vue "Accueil" (Liste des jours d'entraînement du programme actif).
 */
function renderHome() {
    let html = '';
    const progDays = getProgDays();
    const activeProg = getActiveProgram();

    html += `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding: 12px; background: var(--surface-light); border-radius: var(--radius-md); border: 1px solid var(--border);">
            <div>
                <h3 style="color: var(--primary); font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">Programme Actif</h3>
                <p style="color: var(--text); font-size: 16px; margin-top: 4px; font-weight: 600;">${escapeHTML(activeProg.name)}</p>
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
                    <h2>${escapeHTML(day.name)}</h2>
                    <p>${escapeHTML(day.focus)}</p>
                    <span class="day-duration">⏱ ${estimated}</span>
                </div>
            </div>
        `;
    });

    html += `<div style="text-align: center; margin-top: 32px; font-size: 13px; color: var(--text-sec); opacity: 0.6; font-weight: 600;">Mon Programme PWA — ${APP_VERSION}</div>`;
    mainContent.innerHTML = html;
}

/**
 * Met à jour la modale de sélection de profil (Utilisateurs et Export/Import JSON).
 */
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

    programs.forEach(p => {
        const isActive = p.id === activeId;
        html += `
            <div class="day-card" style="border: ${isActive ? '2px solid var(--primary)' : '1px solid var(--border)'}; flex-direction: column; align-items: flex-start; gap: 12px; cursor: default; padding-bottom: 16px;">
                <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div class="day-icon">${isActive ? '⭐' : '📄'}</div>
                        <h3 style="font-size: 18px;">${escapeHTML(p.name)}</h3>
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
                let exName = exId;
                const activeProgExos = getProgExo(session.dayId) || [];
                const foundEx = activeProgExos.find(e => e.id === exId);
                if (foundEx) exName = foundEx.name;

                detailsHtml += `<div class="history-ex-title">
                                    <span>${escapeHTML(exName)}</span>
                                    <button class="btn-delete-history btn-delete-ex" onclick="deleteHistoryExercise(${session.id}, '${exId}')" title="Supprimer cet exercice">${deleteIcon}</button>
                                </div><ul>`;

                sets.forEach((s, idx) => {
                    if (s.checked) {
                        totalSets++;
                        if (s.kg && s.reps) totalVol += (parseFloat(s.kg) * parseInt(s.reps));
                        detailsHtml += `<li>Série ${idx + 1} : ${escapeHTML(s.kg) || 0} kg × ${escapeHTML(s.reps) || 0} reps <button class="btn-delete-history" onclick="deleteHistorySet(${session.id}, '${exId}', ${idx})" title="Supprimer cette série">${deleteIcon}</button></li>`;
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
                Volume total : ${totalVol > 0 ? `<b>${totalVol} kg</b>` : '-'}
                ${durationStr ? `<br>Durée : <b>${durationStr}</b>` : ''}
            </div>
            ${detailsHtml}
        `;
        container.appendChild(card);
    });

    mainContent.appendChild(container);
}

/**
 * Affiche l'onglet Statistiques, incluant le volume cumulé et le graphique des 10 dernières séances.
 */
function renderStats() {
    if (historyData.length === 0) {
        mainContent.innerHTML = '<div style="text-align:center; margin-top: 40px; color: var(--text-sec)">Aucune donnée disponible pour le moment. Terminez une séance pour débloquer cet onglet !</div>';
        return;
    }

    let totalVolume = 0;
    let totalWorkouts = historyData.length;

    // Calculer le volume pour chaque séance (dans l'ordre chronologique pour le graph)
    // historyData est stocké dans l'ordre d'insertion (ancien -> récent) ou inverse ?
    // Non, il faut le trier par date croissante pour le graphique, et on prend les 10 dernières
    const sortedHistory = [...historyData].sort((a, b) => a.date - b.date); 
    
    const sessionsVolume = sortedHistory.map(session => {
        let vol = 0;
        Object.values(session.data).forEach(sets => {
            sets.forEach(s => {
                if (s.checked && s.kg && s.reps) vol += (parseFloat(s.kg) * parseInt(s.reps));
            });
        });
        totalVolume += vol;
        // Format court: ex "14 fév"
        const dateObj = new Date(session.date);
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const dayStr = dateObj.toLocaleDateString('fr-FR', { weekday: 'short' }).replace('.', '').toUpperCase();
        return {
            date: `${day}/${month}`,
            dayStr: dayStr,
            vol: vol
        };
    });

    // 10 Dernières pour le graph
    const recentSessions = sessionsVolume.slice(-10);
    const maxVol = Math.max(...recentSessions.map(s => s.vol), 1); 
    const MAX_BAR_PX = 90; // Hauteur max en pixels pour la barre

    let chartHtml = '';
    recentSessions.forEach(s => {
        const hPx = Math.max(Math.round((s.vol / maxVol) * MAX_BAR_PX), 4); // Min 4px
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

    mainContent.innerHTML = `
        <div class="stats-container">
            <h2 style="font-size: 20px; color: var(--text); display: flex; align-items: center; gap: 8px;">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="var(--primary)" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
                Impact Global
            </h2>
            <div style="display: flex; gap: 16px;">
                <div class="stat-card" style="flex: 1;">
                    <div style="font-size: 13px; color: var(--text-sec);">Séances validées</div>
                    <div class="stat-number">${totalWorkouts}</div>
                </div>
                <div class="stat-card" style="flex: 1;">
                    <div style="font-size: 13px; color: var(--text-sec);">Volume total</div>
                    <div class="stat-number" style="font-size: 24px;">${totalVolume.toLocaleString('fr-FR')} <span style="font-size: 14px">kg</span></div>
                </div>
            </div>
            
            <div class="stat-card" style="margin-top: 8px;">
                <h3 style="font-size: 14px; text-align: left; margin-bottom: 8px; color: var(--text-sec);">Progression (10 dernières séances)</h3>
                <div class="chart-container">
                    ${chartHtml}
                </div>
            </div>
        </div>
    `;
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

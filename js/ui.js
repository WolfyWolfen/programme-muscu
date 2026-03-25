// js/ui.js
const mainContent = document.getElementById('main-content');
const backBtn = document.getElementById('back-btn');
const headerSubtitle = document.getElementById('header-subtitle');
const navBtns = document.querySelectorAll('.nav-btn');

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
        backBtn.onclick = () => switchView('home');
        renderProgramsList();
    } else if (view === 'editor') {
        headerSubtitle.textContent = 'Éditeur de Programme';
        backBtn.onclick = () => switchView('programs');
        renderProgramEditor(param);
    }

    if (view === 'home' || view === 'history') {
        backBtn.onclick = () => switchView('home');
    }
}

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

window.selectProgram = function (id) {
    localStorage.setItem(getKey('active_program_id'), id);
    showToast();
    switchView('home');
};

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

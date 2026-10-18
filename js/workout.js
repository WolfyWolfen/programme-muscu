// js/workout.js

let sessionTimerInterval = null;
let sessionStartTime = null;
let sessionAccumulatedMs = 0;

/**
 * Calcule le temps total écoulé de la séance en secondes (en tenant compte des pauses).
 * @returns {number} Durée écoulée en secondes
 */
function getSessionElapsedSec() {
    let totalMs = sessionAccumulatedMs;
    if (sessionStartTime) {
        totalMs += (Date.now() - sessionStartTime);
    }
    return Math.floor(totalMs / 1000);
}

/**
 * Réinitialise complètement le chronomètre global de la séance.
 */
function resetSessionTimer() {
    clearInterval(sessionTimerInterval);
    sessionTimerInterval = null;
    sessionStartTime = null;
    sessionAccumulatedMs = 0;
}

/**
 * Lance (ou relance) le chronomètre global de la séance.
 */
function startSessionTimer() {
    if (sessionTimerInterval) return;
    sessionStartTime = Date.now();
    clearInterval(sessionTimerInterval);
    sessionTimerInterval = setInterval(() => {
        const display = document.getElementById('session-timer-display');
        if (!display) { clearInterval(sessionTimerInterval); sessionTimerInterval = null; return; }
        display.textContent = formatDuration(getSessionElapsedSec());
    }, 1000);
    const display = document.getElementById('session-timer-display');
    if (display) display.textContent = formatDuration(getSessionElapsedSec());
    const startBtn = document.getElementById('session-start-btn');
    if (startBtn) startBtn.textContent = '⏸';
}

/**
 * Arrête le chronomètre global de la séance et renvoie la durée finale.
 * @returns {number} La durée totale écoulée en secondes
 */
function stopSessionTimer() {
    const duration = getSessionElapsedSec();
    resetSessionTimer();
    return duration;
}

/**
 * Bascule l'état (Play/Pause) du chronomètre global de la séance.
 */
window.toggleSessionTimer = function () {
    const startBtn = document.getElementById('session-start-btn');
    if (sessionTimerInterval) {
        clearInterval(sessionTimerInterval);
        sessionTimerInterval = null;
        if (sessionStartTime) {
            sessionAccumulatedMs += (Date.now() - sessionStartTime);
            sessionStartTime = null;
        }
        if (startBtn) startBtn.textContent = '▶';
    } else {
        startSessionTimer();
        if (startBtn) startBtn.textContent = '⏸';
    }
};

let lastSessionRefData = {};

/**
 * Met à jour la barre de progression globale de la séance en cours.
 */
function updateWorkoutProgress() {
    let total = 0;
    let done = 0;
    Object.values(currentWorkoutData).forEach(sets => {
        sets.forEach(s => {
            total++;
            if (s.checked) done++;
        });
    });
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    const fill = document.getElementById('workout-progress-fill');
    const txt = document.getElementById('workout-progress-text');
    if (fill) fill.style.width = `${pct}%`;
    if (txt) txt.textContent = `${done} / ${total} séries (${pct}%)`;
}

/**
 * Démarre une nouvelle séance complète pour la journée sélectionnée.
 * Prépare les données (via historique/brouillons/références) pour pré-remplir l'UI.
 * @param {string} dayId - L'ID de la journée (ex: "lundi")
 */
window.startWorkout = function(dayId) {
    resetSessionTimer();
    setWakeLock(true);
    activeWorkoutDay = getProgDays().find(d => d.id === dayId);
    currentWorkoutData = {};
    lastSessionRefData = {};

    headerSubtitle.textContent = `${escapeHTML(activeWorkoutDay.name)} - ${escapeHTML(activeWorkoutDay.focus)}`;
    switchView('workout');

    const exercises = getProgExo(dayId) || [];

    const lastWorkout = historyData.filter(h => h.dayId === dayId).sort((a, b) => b.date - a.date)[0];
    const drafts = JSON.parse(localStorage.getItem(getKey('my_workout_drafts'))) || {};
    const refWeights = JSON.parse(localStorage.getItem(getKey('my_reference_weights'))) || {};
    const exNotes = getExerciseNotes();

    const container = document.createElement('div');

    const timerBanner = document.createElement('div');
    timerBanner.className = 'session-timer-banner';
        const calcSvg = '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"></rect><line x1="8" y1="6" x2="16" y2="6"></line><line x1="8" y1="10" x2="8" y2="10"></line><line x1="12" y1="10" x2="12" y2="10"></line><line x1="16" y1="10" x2="16" y2="10"></line><line x1="8" y1="14" x2="8" y2="14"></line><line x1="12" y1="14" x2="12" y2="14"></line><line x1="16" y1="14" x2="16" y2="14"></line><line x1="8" y1="18" x2="8" y2="18"></line><line x1="12" y1="18" x2="16" y2="18"></line></svg>';

        timerBanner.innerHTML = `
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>Durée séance</span>
            <span id="session-timer-display" class="session-timer-value">--:--</span>
            <button class="plate-calc-trigger" onclick="openPlateCalculator(60)" title="Calculateur de disques">${calcSvg}</button>
            <button id="session-start-btn" class="session-start-btn" onclick="toggleSessionTimer()">▶</button>
        `;
        container.appendChild(timerBanner);

        const progressBanner = document.createElement('div');
        progressBanner.className = 'workout-progress-container';
        progressBanner.innerHTML = `
            <div class="workout-progress-header">
                <span>Progression séance</span>
                <span id="workout-progress-text">0 / 0 séries (0%)</span>
            </div>
            <div class="workout-progress-bar">
                <div id="workout-progress-fill" class="workout-progress-fill" style="width: 0%;"></div>
            </div>
        `;
        container.appendChild(progressBanner);

        exercises.forEach((ex, idx) => {
            const targetSets = ex.sets ?? 3;
            const prevSets = (lastWorkout && lastWorkout.data[ex.id])
                ? lastWorkout.data[ex.id]
                : (refWeights[dayId] && refWeights[dayId][ex.id] ? refWeights[dayId][ex.id] : []);
            lastSessionRefData[ex.id] = prevSets;

            let defaultSets = [];
            if (drafts[dayId] && drafts[dayId][ex.id]) {
                defaultSets = drafts[dayId][ex.id];
            } else if (refWeights[dayId] && refWeights[dayId][ex.id]) {
                defaultSets = refWeights[dayId][ex.id].map(s => ({ ...s, checked: false }));
            } else if (lastWorkout && lastWorkout.data[ex.id]) {
                defaultSets = lastWorkout.data[ex.id].map(s => ({ ...s, checked: false }));
            } else {
                defaultSets = [];
            }

            while (defaultSets.length < targetSets) {
                const last = defaultSets[defaultSets.length - 1];
                defaultSets.push({ kg: last?.kg || '', reps: last?.reps || '', checked: false });
            }

            currentWorkoutData[ex.id] = defaultSets;
            const best = getHistoricalBest(ex.id);
            const noteVal = exNotes[ex.id] || '';

            const card = document.createElement('div');
            card.className = 'exercise-card stagger-item';
            card.id = `card-${ex.id}`;
            card.style.animationDelay = `${idx * 50}ms`;
            card.innerHTML = `
                <div class="exercise-header">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
                        <h3>${escapeHTML(ex.name)}</h3>
                        <div style="display: flex; gap: 6px; align-items: center;">
                            <span id="ex-done-badge-${ex.id}" class="ex-done-badge hidden">✓ Terminé</span>
                            ${best.maxKg > 0 ? `<span class="ex-best-badge" title="Meilleur 1RM estimé : ${best.max1RM} kg">🏆 Max: ${best.maxKg}kg</span>` : ''}
                        </div>
                    </div>
                    <input type="text" class="ex-note-input" placeholder="Ajouter une note (réglage banc, ressenti...)" value="${escapeHTML(noteVal)}" oninput="saveExerciseNote('${ex.id}', this.value)">
                </div>
                <div class="sets-container" id="sets-${ex.id}"></div>
                <button class="btn-add-set" onclick="addSet('${ex.id}')">+ Ajouter une série</button>
            `;
            container.appendChild(card);

            setTimeout(() => renderSets(ex.id), 0);
        });

    const saveBtn = document.createElement('button');
    saveBtn.className = 'btn-save-workout';
    saveBtn.textContent = 'Terminer & Sauvegarder';
    saveBtn.onclick = saveWorkout;
    container.appendChild(saveBtn);

    mainContent.appendChild(container);
    setTimeout(updateWorkoutProgress, 10);
}

/**
 * Sauvegarde silencieusement l'état en cours d'une séance (brouillon) pour 
 * prévenir les pertes de données en cas de fermeture/crash.
 */
function saveDraft() {
    if (activeWorkoutDay) {
        let drafts = JSON.parse(localStorage.getItem(getKey('my_workout_drafts'))) || {};
        drafts[activeWorkoutDay.id] = currentWorkoutData;
        localStorage.setItem(getKey('my_workout_drafts'), JSON.stringify(drafts));
    }
}

/**
 * Efface le brouillon de la séance en cours.
 */
function clearDraft() {
    if (activeWorkoutDay) {
        let drafts = JSON.parse(localStorage.getItem(getKey('my_workout_drafts'))) || {};
        delete drafts[activeWorkoutDay.id];
        localStorage.setItem(getKey('my_workout_drafts'), JSON.stringify(drafts));
    }
}

/**
 * Ajoute une série supplémentaires à un exercice pendant une séance (pré-remplie avec la série précédente).
 * @param {string} exId - L'identifiant de l'exercice
 */
window.addSet = function (exId) {
    const sets = currentWorkoutData[exId];
    const last = sets[sets.length - 1];
    currentWorkoutData[exId].push({ kg: last?.kg || '', reps: last?.reps || '', checked: false });
    renderSets(exId);
    updateWorkoutProgress();
    saveDraft();
};

/**
 * Vérifie si une série constitue un nouveau Record Personnel (PR) par rapport à l'historique.
 * @param {string} exId - L'ID de l'exercice
 * @param {Object} set - La série { kg, reps, checked }
 * @returns {boolean} true si c'est un PR validé
 */
function isSetPR(exId, set) {
    if (!set.checked || !set.kg || !set.reps) return false;
    const best = getHistoricalBest(exId);
    if (best.max1RM === 0) return false; // Pas d'historique antérieur = 1ère séance
    const current1RM = calcOneRM(set.kg, set.reps);
    const currentKg = parseFloat(set.kg) || 0;
    return current1RM > best.max1RM || currentKg > best.maxKg;
}

/**
 * Valide ou invalide une série spécifique.
 * Met à jour l'UI, détecte les PR, déclenche le chronomètre de séance si non lancé, et lance le Timer de Repos.
 * @param {string} exId - L'ID de l'exercice
 * @param {number} setIndex - L'index de la série dans le tableau
 */
window.toggleCheck = function (exId, setIndex) {
    const isChecked = currentWorkoutData[exId][setIndex].checked;
    currentWorkoutData[exId][setIndex].checked = !isChecked;

    if (!isChecked) {
        // Démarrage auto du chrono de séance à la 1ère série cochée si jamais lancé
        if (!sessionTimerInterval && sessionAccumulatedMs === 0) {
            startSessionTimer();
        }
        const set = currentWorkoutData[exId][setIndex];
        if (isSetPR(exId, set)) {
            showToast('🏆 Nouveau Record Personnel (PR) !');
        }
        const exoDef = getProgExo(activeWorkoutDay.id).find(e => e.id === exId);
        const rest = exoDef?.rest ?? 90;
        if (rest > 0) startTimer(rest);
    }

    renderSets(exId);
    updateWorkoutProgress();
    saveDraft();
};

window.deleteSet = function (exId, setIndex) {
    if (currentWorkoutData[exId].length > 1) {
        currentWorkoutData[exId].splice(setIndex, 1);
        renderSets(exId);
        updateWorkoutProgress();
        saveDraft();
    } else {
        alert("Impossible de supprimer la dernière série. Laissez-la vide si vous ne la faites pas.");
    }
};

window.updateInput = function (exId, setIndex, field, value) {
    currentWorkoutData[exId][setIndex][field] = value;
    saveDraft();
};

window.stepInput = function (exId, setIndex, field, delta) {
    const current = parseFloat(currentWorkoutData[exId][setIndex][field]) || 0;
    const next = Math.max(0, Math.round((current + delta) * 10) / 10);
    currentWorkoutData[exId][setIndex][field] = String(next);
    renderSets(exId);
    saveDraft();
};

window.renderSets = function (exId) {
    const container = document.getElementById(`sets-${exId}`);
    if (!container) return;

    const sets = currentWorkoutData[exId];
    const prevSets = lastSessionRefData[exId] || [];
    const allChecked = sets.length > 0 && sets.every(s => s.checked);
    const card = document.getElementById(`card-${exId}`);
    const doneBadge = document.getElementById(`ex-done-badge-${exId}`);
    if (card) card.classList.toggle('exercise-completed', allChecked);
    if (doneBadge) doneBadge.classList.toggle('hidden', !allChecked);

    let html = '';

    sets.forEach((set, i) => {
        const checkedClass = set.checked ? 'completed' : '';
        const prBadge = isSetPR(exId, set) ? '<span class="pr-badge" title="Record Personnel !">🏆 PR</span>' : '';
        const prev = prevSets[i];
        const prevHint = (prev && (prev.kg || prev.reps))
            ? `<div class="set-prev-hint">Précédent : <b>${escapeHTML(prev.kg || 0)}kg × ${escapeHTML(prev.reps || 0)}</b> ${prBadge}</div>`
            : (prBadge ? `<div class="set-prev-hint">${prBadge}</div>` : '');

        const checkIcon = set.checked ?
            '<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>' :
            '<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>';

        html += `
            <div class="set-block ${checkedClass}">
                <div class="set-row" id="set-row-${exId}-${i}">
                    <div class="set-number" onclick="openPlateCalculator('${escapeHTML(set.kg || 60)}')" title="Calculer les disques pour cette charge">${i + 1}</div>
                    <div class="input-group">
                        <input type="number" step="0.5" placeholder="Poids" value="${escapeHTML(set.kg)}" oninput="updateInput('${exId}', ${i}, 'kg', this.value)">
                        <span>KG</span>
                    </div>
                    <div class="input-group">
                        <input type="number" placeholder="Reps" value="${escapeHTML(set.reps)}" oninput="updateInput('${exId}', ${i}, 'reps', this.value)">
                        <span>REPS</span>
                        <button class="btn-step-rep" onclick="stepInput('${exId}', ${i}, 'reps', 1)" title="+1 rep">+1</button>
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
                ${prevHint}
            </div>
        `;
    });

    container.innerHTML = html;
}

window.saveWorkout = function () {
    const duration = stopSessionTimer();
    setWakeLock(false);
    closeTimer();
    const exerciseNames = {};
    (getProgExo(activeWorkoutDay.id) || []).forEach(ex => {
        exerciseNames[ex.id] = ex.name;
    });

    const newEntry = {
        id: Date.now(),
        date: Date.now(),
        dayId: activeWorkoutDay.id,
        dayName: activeWorkoutDay.name,
        duration: duration,
        exerciseNames: exerciseNames,
        data: currentWorkoutData
    };

    historyData.push(newEntry);
    localStorage.setItem(getKey('my_workout_history'), JSON.stringify(historyData));

    const refWeights = JSON.parse(localStorage.getItem(getKey('my_reference_weights'))) || {};
    refWeights[activeWorkoutDay.id] = currentWorkoutData;
    localStorage.setItem(getKey('my_reference_weights'), JSON.stringify(refWeights));

    clearDraft();
    showToast();
    switchView('home');
}

// Timer de Repos basé sur l'horloge système (résistant à la mise en veille mobile)
let timerInterval = null;
let timerSeconds = 0;
let timerTotalSeconds = 90;
let timerEndTime = null;
let isTimerRunning = false;

const timerBar = document.getElementById('timer-bar');
const timerDisplay = document.getElementById('timer-display');
const timerToggleBtn = document.getElementById('timer-toggle-btn');

function updateTimerDisplay() {
    const m = Math.floor(timerSeconds / 60).toString().padStart(2, '0');
    const s = (timerSeconds % 60).toString().padStart(2, '0');
    if (timerDisplay) timerDisplay.textContent = `${m}:${s}`;
    const fill = document.getElementById('timer-progress-fill');
    if (fill && timerTotalSeconds > 0) {
        const pct = Math.max(0, Math.min(100, (timerSeconds / timerTotalSeconds) * 100));
        fill.style.width = `${pct}%`;
    }
}

// Fonction utilitaire pour générer le WAV du double bip en mémoire
function createDoubleBeepURI() {
    const sampleRate = 44100;
    const duration1 = 0.1; // Bip 1
    const silence = 0.05;  // Espace
    const duration2 = 0.1; // Bip 2
    const totalDuration = duration1 + silence + duration2;
    const totalSamples = Math.floor(sampleRate * totalDuration);
    
    const buffer = new ArrayBuffer(44 + totalSamples * 2);
    const view = new DataView(buffer);
    
    const writeString = (offset, string) => {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + totalSamples * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true); 
    view.setUint16(20, 1, true); 
    view.setUint16(22, 1, true); 
    view.setUint32(24, sampleRate, true); 
    view.setUint32(28, sampleRate * 2, true); 
    view.setUint16(32, 2, true); 
    view.setUint16(34, 16, true); 
    writeString(36, 'data');
    view.setUint32(40, totalSamples * 2, true);
    
    let offset = 44;
    const period = sampleRate / 1000; // 1000Hz
    
    for (let i = 0; i < totalSamples; i++) {
        const t = i / sampleRate;
        let amplitude = 0;
        
        if ((t >= 0 && t < duration1) || (t >= duration1 + silence && t < totalDuration)) {
            amplitude = (i % period) < (period / 2) ? 1 : -1;
            amplitude *= 0.3; // Volume à 30%
        }
        
        view.setInt16(offset, amplitude * 32767, true);
        offset += 2;
    }
    
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return 'data:audio/wav;base64,' + btoa(binary);
}

// Généré une seule fois au chargement
const DOUBLE_BEEP_URI = createDoubleBeepURI();

function playBeep() {
    try {
        const audio = new Audio(DOUBLE_BEEP_URI);
        audio.play().catch(e => console.warn("Lecture audio bloquée par iOS :", e));
    } catch (e) {
        console.warn("Audio non supporté");
    }
}

function tickRestTimer() {
    if (!isTimerRunning || !timerEndTime) return;
    const remaining = Math.ceil((timerEndTime - Date.now()) / 1000);
    if (remaining <= 0) {
        timerSeconds = 0;
        timerEndTime = null;
        clearInterval(timerInterval);
        isTimerRunning = false;
        if (timerBar) timerBar.classList.add('hidden');
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        playBeep();
        updateTimerDisplay();
    } else {
        timerSeconds = remaining;
        updateTimerDisplay();
    }
}

window.startTimer = function (seconds) {
    timerSeconds = seconds;
    timerTotalSeconds = Math.max(seconds, 1);
    timerEndTime = Date.now() + seconds * 1000;
    isTimerRunning = true;
    if (timerBar) timerBar.classList.remove('hidden');
    updateTimerDisplay();
    updateTimerToggleIcon();

    clearInterval(timerInterval);
    timerInterval = setInterval(tickRestTimer, 250);
};

window.adjustTimer = function (seconds) {
    if (isTimerRunning && timerEndTime) {
        timerEndTime += seconds * 1000;
        timerSeconds = Math.max(0, Math.ceil((timerEndTime - Date.now()) / 1000));
    } else {
        timerSeconds = Math.max(0, timerSeconds + seconds);
    }
    if (timerSeconds > timerTotalSeconds) timerTotalSeconds = timerSeconds;
    updateTimerDisplay();
};

window.toggleTimer = function () {
    if (isTimerRunning) {
        if (timerEndTime) {
            timerSeconds = Math.max(0, Math.ceil((timerEndTime - Date.now()) / 1000));
        }
        isTimerRunning = false;
        timerEndTime = null;
    } else if (timerSeconds > 0) {
        isTimerRunning = true;
        timerEndTime = Date.now() + timerSeconds * 1000;
    }
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
    timerEndTime = null;
    if (timerBar) timerBar.classList.add('hidden');
};


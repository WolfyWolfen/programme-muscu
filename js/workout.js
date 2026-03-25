// js/workout.js

let sessionTimerInterval = null;
let sessionStartTime = null;

function startSessionTimer() {
    if (sessionTimerInterval) return;
    sessionStartTime = sessionStartTime || Date.now();
    clearInterval(sessionTimerInterval);
    sessionTimerInterval = setInterval(() => {
        const display = document.getElementById('session-timer-display');
        if (!display) { clearInterval(sessionTimerInterval); sessionTimerInterval = null; return; }
        const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
        display.textContent = formatDuration(elapsed);
    }, 1000);
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
        clearInterval(sessionTimerInterval);
        sessionTimerInterval = null;
        if (startBtn) startBtn.textContent = '▶';
    } else {
        startSessionTimer();
        if (startBtn) startBtn.textContent = '⏸';
    }
};

window.startWorkout = function(dayId) {
    activeWorkoutDay = getProgDays().find(d => d.id === dayId);
    currentWorkoutData = {};

    headerSubtitle.textContent = `${escapeHTML(activeWorkoutDay.name)} - ${escapeHTML(activeWorkoutDay.focus)}`;
    switchView('workout');

    const exercises = getProgExo(dayId) || [];

    const lastWorkout = historyData.filter(h => h.dayId === dayId).sort((a, b) => b.date - a.date)[0];
    const drafts = JSON.parse(localStorage.getItem(getKey('my_workout_drafts'))) || {};
    const refWeights = JSON.parse(localStorage.getItem(getKey('my_reference_weights'))) || {};

    const container = document.createElement('div');

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

    exercises.forEach((ex) => {
        const targetSets = ex.sets ?? 3;
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

        const card = document.createElement('div');
        card.className = 'exercise-card';
        card.innerHTML = `
            <div class="exercise-header">
                <h3>${escapeHTML(ex.name)}</h3>
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
    renderSets(exId);
    saveDraft();
};

window.toggleCheck = function (exId, setIndex) {
    const isChecked = currentWorkoutData[exId][setIndex].checked;
    currentWorkoutData[exId][setIndex].checked = !isChecked;
    const row = document.getElementById(`set-row-${exId}-${setIndex}`);
    if (row) {
        const btnCheck = row.querySelector('.btn-check');
        if (isChecked) {
            btnCheck.classList.remove('completed');
            btnCheck.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>';
        } else {
            btnCheck.classList.add('completed');
            btnCheck.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
            
            const exoDef = getProgExo(activeWorkoutDay.id).find(e => e.id === exId);
            const rest = exoDef?.rest ?? 90;
            if (rest > 0) startTimer(rest);
        }
    } else {
        renderSets(exId);
    }
    saveDraft();
};

window.deleteSet = function (exId, setIndex) {
    if (currentWorkoutData[exId].length > 1) {
        currentWorkoutData[exId].splice(setIndex, 1);
        renderSets(exId);
        saveDraft();
    } else {
        alert("Impossible de supprimer la dernière série. Laissez-la vide si vous ne la faites pas.");
    }
};

window.updateInput = function (exId, setIndex, field, value) {
    currentWorkoutData[exId][setIndex][field] = value;
    saveDraft();
};

window.renderSets = function (exId) {
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
            <div class="set-row" id="set-row-${exId}-${i}">
                <div class="set-number">${i + 1}</div>
                <div class="input-group">
                    <input type="number" step="0.5" placeholder="Poids" value="${escapeHTML(set.kg)}" onchange="updateInput('${exId}', ${i}, 'kg', this.value)">
                    <span>KG</span>
                </div>
                <div class="input-group">
                    <input type="number" placeholder="Reps" value="${escapeHTML(set.reps)}" onchange="updateInput('${exId}', ${i}, 'reps', this.value)">
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

window.saveWorkout = function () {
    const duration = stopSessionTimer();

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

    const refWeights = JSON.parse(localStorage.getItem(getKey('my_reference_weights'))) || {};
    refWeights[activeWorkoutDay.id] = currentWorkoutData;
    localStorage.setItem(getKey('my_reference_weights'), JSON.stringify(refWeights));

    clearDraft();
    showToast();
    switchView('home');
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
    // Chunking to avoid Maximum call stack size exceeded if using apply
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return 'data:audio/wav;base64,' + btoa(binary);
}

// Généré une seule fois au chargement
const DOUBLE_BEEP_URI = createDoubleBeepURI();

function playBeep() {
    try {
        // Utilisation de l'élément HTML5 Audio plutôt que l'API AudioContext
        // L'élément <audio> gère infiniment mieux le routage Bluetooth sur iOS Safari
        const audio = new Audio(DOUBLE_BEEP_URI);
        audio.play().catch(e => console.warn("Lecture audio bloquée par iOS :", e));
    } catch (e) {
        console.warn("Audio non supporté");
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

// js/editor.js

let editingProgram = null;

/**
 * Déplace un élément dans un tableau.
 * @param {Array} arr - Le tableau à modifier
 * @param {number} index - L'index de l'élément à déplacer
 * @param {number} direction - -1 (pour monter) ou 1 (pour descendre)
 */
function moveItem(arr, index, direction) {
    if (index < 0 || index >= arr.length) return;
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= arr.length) return;
    
    const temp = arr[index];
    arr[index] = arr[newIndex];
    arr[newIndex] = temp;
}

/**
 * Prépare et affiche l'interface d'édition pour un programme spécifique ou un nouveau programme.
 * @param {string} progId - L'ID du programme à éditer, ou 'new' pour en créer un vierge
 */
function renderProgramEditor(progId) {
    if (progId === 'new') {
        editingProgram = {
            id: 'prog_' + Date.now(),
            name: 'Nouveau Programme',
            days: [],
            exercises: {}
        };
    } else if (!editingProgram || editingProgram.id !== progId) {
        const prog = getMyPrograms().find(p => p.id === progId);
        editingProgram = JSON.parse(JSON.stringify(prog));
    }

    let html = `
        <div style="margin-bottom: 24px;">
            <label style="font-size: 13px; color: var(--text-sec); text-transform: uppercase; font-weight: 800; letter-spacing: 1px;">Nom du Programme</label>
            <input type="text" value="${escapeHTML(editingProgram.name)}" placeholder="Ex: PPL 3 Jours" 
                   onchange="editingProgram.name = this.value" 
                   style="width: 100%; padding: 14px; margin-top: 8px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: var(--surface-light); color: var(--text); font-size: 16px; font-weight: 600;">
        </div>
        <div class="editor-days-list" style="display: flex; flex-direction: column; gap: 24px;">
    `;

    editingProgram.days.forEach((day, dIdx) => {
        const isFirstDay = dIdx === 0;
        const isLastDay = dIdx === editingProgram.days.length - 1;

        html += `
            <div style="background: var(--surface-light); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 12px;">
                    <div style="flex: 1;">
                        <input type="text" value="${escapeHTML(day.name)}" placeholder="Nom (ex: Lundi, Push)" 
                               onchange="editingProgram.days[${dIdx}].name = this.value"
                               style="width: 100%; padding: 10px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: var(--bg); color: var(--text); font-size: 15px; font-weight: bold;">
                    </div>
                    <div style="display: flex; gap: 4px; align-items: center;">
                        <button style="border: 1px solid var(--border); background: var(--surface); color: var(--text-sec); border-radius: 4px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; opacity: ${isFirstDay ? '0.3' : '1'}" onclick="editorMoveDay(${dIdx}, -1)" ${isFirstDay ? 'disabled' : ''}>↑</button>
                        <button style="border: 1px solid var(--border); background: var(--surface); color: var(--text-sec); border-radius: 4px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; opacity: ${isLastDay ? '0.3' : '1'}" onclick="editorMoveDay(${dIdx}, 1)" ${isLastDay ? 'disabled' : ''}>↓</button>
                        <button class="btn-danger" style="padding: 0 12px; height: 32px; border-radius: var(--radius-sm); border: none; background: rgba(255, 23, 68, 0.2); color: var(--danger); margin-left: 8px;" onclick="editorRemoveDay(${dIdx})" title="Supprimer la journée">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                <input type="text" value="${escapeHTML(day.focus)}" placeholder="Focus (ex: Pecs & Triceps)" 
                       onchange="editingProgram.days[${dIdx}].focus = this.value"
                       style="width: 100%; padding: 10px; margin-bottom: 16px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: var(--bg); color: var(--text); font-size: 14px;">
                
                <h4 style="font-size: 13px; color: var(--text-sec); margin-bottom: 8px; text-transform: uppercase;">Exercices</h4>
                <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;">
        `;

        const exos = editingProgram.exercises[day.id] || [];
        exos.forEach((ex, eIdx) => {
            const isFirstEx = eIdx === 0;
            const isLastEx = eIdx === exos.length - 1;

            html += `
                <div style="display: flex; flex-direction: column; gap: 8px; background: var(--bg); padding: 12px; border-radius: var(--radius-sm); border: 1px solid rgba(255,255,255,0.05);">
                    <div style="display: flex; justify-content: space-between; gap: 8px; align-items: flex-start;">
                        <input type="text" value="${escapeHTML(ex.name)}" placeholder="Nom de l'exercice" 
                               onchange="editingProgram.exercises['${day.id}'][${eIdx}].name = this.value"
                               style="flex: 1; min-width: 0; padding: 10px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: var(--surface-light); color: var(--text); font-size: 14px; font-weight: 600;">
                        
                        <div style="display: flex; gap: 4px; flex-shrink: 0;">
                            <div style="display: flex; flex-direction: column; gap: 2px;">
                                <button style="border: 1px solid var(--border); background: var(--surface); color: var(--text-sec); border-radius: 4px; width: 24px; height: 18px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 10px; opacity: ${isFirstEx ? '0.3' : '1'};" onclick="editorMoveEx('${day.id}', ${eIdx}, -1)" ${isFirstEx ? 'disabled' : ''}>▲</button>
                                <button style="border: 1px solid var(--border); background: var(--surface); color: var(--text-sec); border-radius: 4px; width: 24px; height: 18px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 10px; opacity: ${isLastEx ? '0.3' : '1'};" onclick="editorMoveEx('${day.id}', ${eIdx}, 1)" ${isLastEx ? 'disabled' : ''}>▼</button>
                            </div>
                            <button class="btn-danger" style="margin-left: 4px; width: 32px; border-radius: var(--radius-sm); border: none; background: rgba(255, 23, 68, 0.2); color: var(--danger);" onclick="editorRemoveEx('${day.id}', ${eIdx})">X</button>
                        </div>
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
        <button class="btn-add-set" style="margin-top: 24px; margin-bottom: 24px;" onclick="editorAddDay()">+ Ajouter une journée entière</button>
        
        <div style="position: sticky; bottom: 20px; padding-top: 20px;">
            <button class="btn-primary" style="width: 100%; padding: 16px; font-size: 16px; font-weight: 800; border-radius: var(--radius-md); box-shadow: var(--shadow);" onclick="saveEditedProgram()">💾 Enregistrer le Programme</button>
        </div>
        <div style="height: 60px;"></div> <!-- Espace pour s'assurer que le bas scrolle assez -->
    `;

    mainContent.innerHTML = html;
}

/**
 * Monte ou descend une journée entière dans l'éditeur.
 * @param {number} index - Index actuel de la journée
 * @param {number} dir - Direction (-1 pour monter, 1 pour descendre)
 */
window.editorMoveDay = function (index, dir) {
    moveItem(editingProgram.days, index, dir);
    renderProgramEditor(editingProgram.id);
};

/**
 * Monte ou descend un exercice au sein d'une journée dans l'éditeur.
 * @param {string} dayId - ID de la journée
 * @param {number} index - Index actuel de l'exercice
 * @param {number} dir - Direction (-1 pour monter, 1 pour descendre)
 */
window.editorMoveEx = function (dayId, index, dir) {
    if (!editingProgram.exercises[dayId]) return;
    moveItem(editingProgram.exercises[dayId], index, dir);
    renderProgramEditor(editingProgram.id);
};

/**
 * Ajoute une nouvelle journée vide au programme en cours d'édition.
 */
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

/**
 * Supprime une journée entière (et tous ses exercices) du programme.
 * @param {number} index - Index de la journée à supprimer
 */
window.editorRemoveDay = function (index) {
    if (confirm('Supprimer ce jour et tous ses exercices ?')) {
        const dayId = editingProgram.days[index].id;
        editingProgram.days.splice(index, 1);
        delete editingProgram.exercises[dayId];
        renderProgramEditor(editingProgram.id);
    }
};

/**
 * Ajoute un nouvel exercice vide à une journée précise.
 * @param {string} dayId - ID de la journée
 */
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

/**
 * Supprime un exercice spécifique.
 * @param {string} dayId - ID de la journée
 * @param {number} exIndex - Index de l'exercice
 */
window.editorRemoveEx = function (dayId, exIndex) {
    editingProgram.exercises[dayId].splice(exIndex, 1);
    renderProgramEditor(editingProgram.id);
};

/**
 * Enregistre le programme en cours d'édition dans le localStorage 
 * (soit en l'ajoutant, soit en le remplaçant s'il existe déjà).
 */
window.saveEditedProgram = function () {
    if (!editingProgram.name.trim()) {
        alert("Veuillez donner un nom au programme.");
        return;
    }
    if (editingProgram.days.length === 0) {
        alert("Le programme doit contenir au moins une journée d'entraînement.");
        return;
    }

    let programs = getMyPrograms();
    const existingIndex = programs.findIndex(p => p.id === editingProgram.id);

    if (existingIndex >= 0) {
        programs[existingIndex] = editingProgram;
    } else {
        programs.push(editingProgram);
    }

    localStorage.setItem('all_custom_programs', JSON.stringify(programs));
    editingProgram = null;
    showToast();
    switchView('programs');
};

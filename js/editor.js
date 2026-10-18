// js/editor.js

let editingProgram = null;
let collapsedDays = {};

/**
 * Bibliothèque d'exercices standards classés par groupe musculaire.
 * Utiliser les mêmes IDs permet de partager l'historique de poids et les PR entre tous les programmes.
 */
const EXERCISE_CATALOG = {
    "Pectoraux": [
        { id: 'dc_barre', name: 'Développé Couché Barre', sets: 4, rest: 120 },
        { id: 'dc_halteres', name: 'Développé Couché Haltères', sets: 4, rest: 90 },
        { id: 'di_halteres', name: 'Développé Incliné Haltères', sets: 4, rest: 90 },
        { id: 'dev_incline_machine', name: 'Développé Incliné Machine', sets: 4, rest: 90 },
        { id: 'ecarte_poulie', name: 'Écarté Poulie Vis-à-vis', sets: 3, rest: 60 },
        { id: 'pec_deck', name: 'Pec Deck / Butterfly', sets: 3, rest: 60 },
        { id: 'dips', name: 'Dips (lestés si possible)', sets: 4, rest: 90 },
        { id: 'pullover_haltere', name: 'Pull-over Haltère', sets: 3, rest: 75 }
    ],
    "Dos": [
        { id: 'tractions', name: 'Tractions / Traction lestée', sets: 4, rest: 120 },
        { id: 'tirage_poitrine', name: 'TirageVertical Poitrine', sets: 4, rest: 90 },
        { id: 'rowing_barre', name: 'Rowing Barre (penché)', sets: 4, rest: 120 },
        { id: 'rowing_haltere', name: 'Rowing Haltère Unilatéral', sets: 3, rest: 90 },
        { id: 'tirage_poulie_basse', name: 'Tirage Horizontal Poulie Basse', sets: 3, rest: 75 },
        { id: 'pullover_poulie', name: 'Pull-over Poulie Haute', sets: 3, rest: 60 }
    ],
    "Épaules": [
        { id: 'dev_milit_halteres', name: 'Développé Militaire Haltères', sets: 4, rest: 90 },
        { id: 'dev_milit_barre', name: 'Développé Militaire Barre (OHP)', sets: 4, rest: 120 },
        { id: 'elev_lat', name: 'Élévations Latérales Haltères', sets: 4, rest: 60 },
        { id: 'elev_lat_poulie', name: 'Élévations Latérales Poulie', sets: 3, rest: 60 },
        { id: 'oiseau', name: 'Oiseau / Face Pull', sets: 3, rest: 60 }
    ],
    "Jambes": [
        { id: 'squat_barre', name: 'Squat Barre (Quadriceps)', sets: 4, rest: 150 },
        { id: 'presse_cuisses', name: 'Presse à Cuisses Inclinée', sets: 4, rest: 120 },
        { id: 'hack_squat', name: 'Hack Squat', sets: 4, rest: 120 },
        { id: 'fentes_halteres', name: 'Fentes Marchées / Bulgares', sets: 3, rest: 90 },
        { id: 'leve_jambe', name: 'Leg Extension Machine', sets: 3, rest: 75 },
        { id: 'rdl_halteres', name: 'Soulevé de Terre Jambes Tendues', sets: 4, rest: 120 },
        { id: 'leg_curl', name: 'Leg Curl Assis / Allongé (Ischios)', sets: 4, rest: 75 },
        { id: 'hip_thrust', name: 'Hip Thrust Barre (Fessiers)', sets: 4, rest: 120 },
        { id: 'mollets_debout', name: 'Mollets Debout / Presse', sets: 4, rest: 60 }
    ],
    "Bras": [
        { id: 'curl_barre_ez', name: 'Curl Barre EZ', sets: 3, rest: 75 },
        { id: 'curl_incline', name: 'Curl Incliné Haltères', sets: 3, rest: 75 },
        { id: 'curl_marteau', name: 'Curl Marteau Haltères', sets: 3, rest: 60 },
        { id: 'skull_crusher', name: 'Barre au Front (Skull Crusher)', sets: 3, rest: 75 },
        { id: 'ext_triceps_poulie', name: 'Extension Triceps Poulie Haute (Corde)', sets: 4, rest: 60 },
        { id: 'ext_nuque_haltere', name: 'Extension Triceps Overhead', sets: 3, rest: 75 },
        { id: 'superset_bras', name: 'Superset — Curl/Kickback', sets: 3, rest: 60 }
    ],
    "Abdos & Cardio": [
        { id: 'crunch_poulie', name: 'Crunch Poulie Haute / Machine', sets: 4, rest: 60 },
        { id: 'releve_jambes', name: 'Relevé de Jambes Suspendu', sets: 3, rest: 60 },
        { id: 'gainage_planche', name: 'Gainage Planche', sets: 3, rest: 60 },
        { id: 'cardio', name: 'Course / Vélo / Elliptique (30-45m)', sets: 1, rest: 0 },
        { id: 'hiit_cardio', name: 'HIIT / Fractionné (15-20m)', sets: 1, rest: 0 }
    ]
};

/**
 * Modèles de programmes prêts à l'emploi pour démarrer rapidement.
 */
const PROGRAM_TEMPLATES = {
    ppl: {
        name: 'Push / Pull / Legs (3 Jours)',
        days: [
            { id: 'push', name: 'Push', focus: 'Pecs, Épaules & Triceps', icon: 'dumbbell' },
            { id: 'pull', name: 'Pull', focus: 'Dos, Trapèzes & Biceps', icon: 'pullup' },
            { id: 'legs', name: 'Legs', focus: 'Quadriceps, Ischios & Mollets', icon: 'barbell' }
        ],
        exercises: {
            push: [
                { id: 'dc_barre', name: 'Développé Couché Barre', sets: 4, rest: 120 },
                { id: 'di_halteres', name: 'Développé Incliné Haltères', sets: 4, rest: 90 },
                { id: 'dev_milit_halteres', name: 'Développé Militaire Haltères', sets: 3, rest: 90 },
                { id: 'elev_lat', name: 'Élévations Latérales Haltères', sets: 4, rest: 60 },
                { id: 'ext_triceps_poulie', name: 'Extension Triceps Poulie Haute (Corde)', sets: 4, rest: 60 }
            ],
            pull: [
                { id: 'tractions', name: 'Tractions / Traction lestée', sets: 4, rest: 120 },
                { id: 'rowing_barre', name: 'Rowing Barre (penché)', sets: 4, rest: 120 },
                { id: 'tirage_poulie_basse', name: 'Tirage Horizontal Poulie Basse', sets: 3, rest: 75 },
                { id: 'oiseau', name: 'Oiseau / Face Pull', sets: 3, rest: 60 },
                { id: 'curl_barre_ez', name: 'Curl Barre EZ', sets: 3, rest: 75 },
                { id: 'curl_marteau', name: 'Curl Marteau Haltères', sets: 3, rest: 60 }
            ],
            legs: [
                { id: 'squat_barre', name: 'Squat Barre (Quadriceps)', sets: 4, rest: 150 },
                { id: 'presse_cuisses', name: 'Presse à Cuisses Inclinée', sets: 4, rest: 120 },
                { id: 'rdl_halteres', name: 'Soulevé de Terre Jambes Tendues', sets: 4, rest: 120 },
                { id: 'leve_jambe', name: 'Leg Extension Machine', sets: 3, rest: 75 },
                { id: 'leg_curl', name: 'Leg Curl Assis / Allongé (Ischios)', sets: 3, rest: 75 },
                { id: 'mollets_debout', name: 'Mollets Debout / Presse', sets: 4, rest: 60 }
            ]
        }
    },
    upper_lower: {
        name: 'Upper / Lower (4 Jours)',
        days: [
            { id: 'upper_a', name: 'Upper A', focus: 'Haut du Corps (Force)', icon: 'upper' },
            { id: 'lower_a', name: 'Lower A', focus: 'Bas du Corps (Dominante Quad)', icon: 'barbell' },
            { id: 'upper_b', name: 'Upper B', focus: 'Haut du Corps (Hypertrophie)', icon: 'dumbbell' },
            { id: 'lower_b', name: 'Lower B', focus: 'Bas du Corps (Dominante Ischios)', icon: 'barbell' }
        ],
        exercises: {
            upper_a: [
                { id: 'dc_barre', name: 'Développé Couché Barre', sets: 4, rest: 120 },
                { id: 'rowing_barre', name: 'Rowing Barre (penché)', sets: 4, rest: 120 },
                { id: 'dev_milit_halteres', name: 'Développé Militaire Haltères', sets: 3, rest: 90 },
                { id: 'tractions', name: 'Tractions / Traction lestée', sets: 3, rest: 120 },
                { id: 'curl_barre_ez', name: 'Curl Barre EZ', sets: 3, rest: 75 },
                { id: 'skull_crusher', name: 'Barre au Front (Skull Crusher)', sets: 3, rest: 75 }
            ],
            lower_a: [
                { id: 'squat_barre', name: 'Squat Barre (Quadriceps)', sets: 4, rest: 150 },
                { id: 'rdl_halteres', name: 'Soulevé de Terre Jambes Tendues', sets: 3, rest: 120 },
                { id: 'presse_cuisses', name: 'Presse à Cuisses Inclinée', sets: 3, rest: 120 },
                { id: 'leg_curl', name: 'Leg Curl Assis / Allongé (Ischios)', sets: 3, rest: 75 },
                { id: 'mollets_debout', name: 'Mollets Debout / Presse', sets: 4, rest: 60 }
            ],
            upper_b: [
                { id: 'di_halteres', name: 'Développé Incliné Haltères', sets: 4, rest: 90 },
                { id: 'tirage_poitrine', name: 'Tirage Vertical Poitrine', sets: 4, rest: 90 },
                { id: 'dips', name: 'Dips (lestés si possible)', sets: 3, rest: 90 },
                { id: 'tirage_poulie_basse', name: 'Tirage Horizontal Poulie Basse', sets: 3, rest: 75 },
                { id: 'elev_lat', name: 'Élévations Latérales Haltères', sets: 4, rest: 60 },
                { id: 'ext_triceps_poulie', name: 'Extension Triceps Poulie Haute (Corde)', sets: 3, rest: 60 }
            ],
            lower_b: [
                { id: 'rdl_halteres', name: 'Soulevé de Terre Jambes Tendues', sets: 4, rest: 120 },
                { id: 'hack_squat', name: 'Hack Squat', sets: 4, rest: 120 },
                { id: 'fentes_halteres', name: 'Fentes Marchées / Bulgares', sets: 3, rest: 90 },
                { id: 'leve_jambe', name: 'Leg Extension Machine', sets: 3, rest: 75 },
                { id: 'crunch_poulie', name: 'Crunch Poulie Haute / Machine', sets: 4, rest: 60 }
            ]
        }
    },
    fullbody: {
        name: 'Full Body (3 Jours)',
        days: [
            { id: 'fb_lundi', name: 'Séance A', focus: 'Full Body Complet', icon: 'upper' },
            { id: 'fb_mercredi', name: 'Séance B', focus: 'Full Body Complet', icon: 'barbell' },
            { id: 'fb_vendredi', name: 'Séance C', focus: 'Full Body Complet', icon: 'dumbbell' }
        ],
        exercises: {
            fb_lundi: [
                { id: 'squat_barre', name: 'Squat Barre (Quadriceps)', sets: 4, rest: 150 },
                { id: 'dc_barre', name: 'Développé Couché Barre', sets: 4, rest: 120 },
                { id: 'rowing_barre', name: 'Rowing Barre (penché)', sets: 4, rest: 120 },
                { id: 'elev_lat', name: 'Élévations Latérales Haltères', sets: 3, rest: 60 },
                { id: 'curl_barre_ez', name: 'Curl Barre EZ', sets: 3, rest: 75 }
            ],
            fb_mercredi: [
                { id: 'rdl_halteres', name: 'Soulevé de Terre Jambes Tendues', sets: 4, rest: 120 },
                { id: 'di_halteres', name: 'Développé Incliné Haltères', sets: 4, rest: 90 },
                { id: 'tractions', name: 'Tractions / Traction lestée', sets: 4, rest: 120 },
                { id: 'dev_milit_halteres', name: 'Développé Militaire Haltères', sets: 3, rest: 90 },
                { id: 'ext_triceps_poulie', name: 'Extension Triceps Poulie Haute (Corde)', sets: 3, rest: 60 }
            ],
            fb_vendredi: [
                { id: 'presse_cuisses', name: 'Presse à Cuisses Inclinée', sets: 4, rest: 120 },
                { id: 'dips', name: 'Dips (lestés si possible)', sets: 4, rest: 90 },
                { id: 'tirage_poulie_basse', name: 'Tirage Horizontal Poulie Basse', sets: 4, rest: 75 },
                { id: 'leg_curl', name: 'Leg Curl Assis / Allongé (Ischios)', sets: 3, rest: 75 },
                { id: 'oiseau', name: 'Oiseau / Face Pull', sets: 3, rest: 60 }
            ]
        }
    }
};

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
 * Estime la durée en minutes d'une liste d'exercices pour l'aperçu de l'éditeur.
 */
function estimateExListMin(exos) {
    if (!exos || exos.length === 0) return 0;
    let sec = 0;
    exos.forEach(ex => {
        sec += (ex.sets || 3) * (40 + (ex.rest ?? 60));
    });
    return Math.round((sec * 1.1) / 60);
}

/**
 * Applique un template préconfiguré (PPL, Upper/Lower, FullBody) dans l'éditeur.
 * @param {string} tplKey - La clé du template
 */
window.applyEditorTemplate = function(tplKey) {
    const tpl = PROGRAM_TEMPLATES[tplKey];
    if (!tpl) return;
    const applyFn = () => {
        const currentId = editingProgram ? editingProgram.id : ('prog_' + Date.now());
        editingProgram = JSON.parse(JSON.stringify(tpl));
        editingProgram.id = currentId;
        collapsedDays = {};
        renderProgramEditor(currentId);
        showToast('Modèle chargé !');
    };
    if (editingProgram && editingProgram.days.length > 0) {
        showConfirm('Remplacer le contenu actuel par ce modèle de programme ?', applyFn);
    } else {
        applyFn();
    }
};

/**
 * Plie ou déplie une journée dans l'éditeur.
 */
window.toggleEditorDayCollapse = function(dayId) {
    collapsedDays[dayId] = !collapsedDays[dayId];
    renderProgramEditor(editingProgram.id);
};

/**
 * Change l'icône d'une journée dans l'éditeur.
 */
window.selectEditorDayIcon = function(dIdx, iconKey) {
    editingProgram.days[dIdx].icon = iconKey;
    renderProgramEditor(editingProgram.id);
};

/**
 * Ajuste le nombre de séries ou le temps de repos d'un exercice via les boutons +/-.
 */
window.stepEditorEx = function(dayId, eIdx, field, delta) {
    const ex = editingProgram.exercises[dayId][eIdx];
    if (!ex) return;
    if (field === 'sets') {
        ex.sets = Math.max(1, (parseInt(ex.sets) || 3) + delta);
    } else if (field === 'rest') {
        ex.rest = Math.max(0, (parseInt(ex.rest) || 0) + delta);
    }
    renderProgramEditor(editingProgram.id);
};

/**
 * Duplique une journée complète avec tous ses exercices au sein du programme en cours d'édition.
 */
window.editorDuplicateDay = function(dIdx) {
    const origDay = editingProgram.days[dIdx];
    if (!origDay) return;
    const newDayId = 'day_' + Date.now();
    const newDay = {
        id: newDayId,
        name: (origDay.name || 'Jour') + ' (Bis)',
        focus: origDay.focus || '',
        icon: origDay.icon || 'dumbbell'
    };
    const origExos = editingProgram.exercises[origDay.id] || [];
    editingProgram.days.splice(dIdx + 1, 0, newDay);
    editingProgram.exercises[newDayId] = JSON.parse(JSON.stringify(origExos));
    renderProgramEditor(editingProgram.id);
    showToast('Journée dupliquée');
};

/**
 * Ouvre la modale du catalogue d'exercices pour ajouter un exercice (ou en créer un personnalisé).
 * @param {string} dayId - L'identifiant de la journée cible
 */
window.openExercisePicker = function(dayId) {
    const existing = document.getElementById('picker-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'picker-modal';

    let categoriesHtml = '';
    Object.entries(EXERCISE_CATALOG).forEach(([catName, exList]) => {
        let itemsHtml = '';
        exList.forEach(item => {
            const safeName = item.name.replace(/'/g, "\\'");
            itemsHtml += `
                <button class="picker-item-btn" data-search="${escapeHTML(item.name.toLowerCase())} ${escapeHTML(catName.toLowerCase())}"
                        onclick="pickCatalogExercise('${dayId}', '${item.id}', '${safeName}', ${item.sets}, ${item.rest})">
                    <span class="picker-item-name">${escapeHTML(item.name)}</span>
                    <span class="picker-item-meta">${item.sets}× • ${item.rest}s</span>
                </button>
            `;
        });
        categoriesHtml += `
            <div class="picker-category">
                <div class="picker-cat-title">${escapeHTML(catName)}</div>
                <div class="picker-cat-items">${itemsHtml}</div>
            </div>
        `;
    });

    modal.innerHTML = `
        <div class="confirm-backdrop"></div>
        <div class="picker-box">
            <div class="picker-header">
                <h3>📚 Ajouter un exercice</h3>
                <button class="picker-close-btn" id="picker-close-btn">✕</button>
            </div>
            <input type="text" id="picker-search-input" class="picker-search" placeholder="🔍 Rechercher (ex: Développé, Squat, Curl...)" autocomplete="off">
            <button class="btn-custom-ex" onclick="pickCustomExercise('${dayId}')">+ Créer un exercice vide personnalisé</button>
            <div class="picker-list" id="picker-list">
                ${categoriesHtml}
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const searchInput = document.getElementById('picker-search-input');
    searchInput.oninput = () => {
        const q = searchInput.value.trim().toLowerCase();
        modal.querySelectorAll('.picker-category').forEach(catEl => {
            let visibleCount = 0;
            catEl.querySelectorAll('.picker-item-btn').forEach(btn => {
                const match = !q || btn.dataset.search.includes(q);
                btn.style.display = match ? 'flex' : 'none';
                if (match) visibleCount++;
            });
            catEl.style.display = visibleCount > 0 ? 'block' : 'none';
        });
    };

    document.getElementById('picker-close-btn').onclick = () => modal.remove();
    modal.querySelector('.confirm-backdrop').onclick = () => modal.remove();
};

window.pickCatalogExercise = function(dayId, exId, name, sets, rest) {
    if (!editingProgram.exercises[dayId]) editingProgram.exercises[dayId] = [];
    // Si l'exercice est déjà présent dans la même journée, lui donner un ID dérivé unique
    const alreadyInDay = editingProgram.exercises[dayId].some(e => e.id === exId);
    const finalId = alreadyInDay ? `${exId}_${Date.now()}` : exId;
    editingProgram.exercises[dayId].push({
        id: finalId,
        name: name,
        sets: sets,
        rest: rest
    });
    const modal = document.getElementById('picker-modal');
    if (modal) modal.remove();
    renderProgramEditor(editingProgram.id);
};

window.pickCustomExercise = function(dayId) {
    const searchInput = document.getElementById('picker-search-input');
    const typedName = searchInput ? searchInput.value.trim() : '';
    if (!editingProgram.exercises[dayId]) editingProgram.exercises[dayId] = [];
    editingProgram.exercises[dayId].push({
        id: 'ex_' + Date.now(),
        name: typedName,
        sets: 3,
        rest: 90
    });
    const modal = document.getElementById('picker-modal');
    if (modal) modal.remove();
    renderProgramEditor(editingProgram.id);
};

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
        collapsedDays = {};
    } else if (!editingProgram || editingProgram.id !== progId) {
        const prog = getMyPrograms().find(p => p.id === progId);
        if (prog) {
            editingProgram = JSON.parse(JSON.stringify(prog));
            collapsedDays = {};
        }
    }

    const iconKeys = ['dumbbell', 'pullup', 'cardio', 'barbell', 'upper'];
    const copySvg = '<svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
    const trashSvg = '<svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>';

    let html = `
        <div class="editor-top-card">
            <label class="editor-section-label">Nom du Programme</label>
            <input type="text" class="editor-prog-name-input" value="${escapeHTML(editingProgram.name)}" placeholder="Ex: PPL 3 Jours" 
                   oninput="editingProgram.name = this.value">

            <div class="editor-templates-bar">
                <span class="editor-tpl-label">⚡ Modèles rapides :</span>
                <div class="editor-tpl-btns">
                    <button class="editor-tpl-chip" onclick="applyEditorTemplate('ppl')">PPL (3j)</button>
                    <button class="editor-tpl-chip" onclick="applyEditorTemplate('upper_lower')">Upper/Lower (4j)</button>
                    <button class="editor-tpl-chip" onclick="applyEditorTemplate('fullbody')">Full Body (3j)</button>
                </div>
            </div>
        </div>

        <div class="editor-days-list">
    `;

    editingProgram.days.forEach((day, dIdx) => {
        const isFirstDay = dIdx === 0;
        const isLastDay = dIdx === editingProgram.days.length - 1;
        const exos = editingProgram.exercises[day.id] || [];
        const isCollapsed = !!collapsedDays[day.id];
        const activeIconKey = resolveDayIconKey(day);
        const estMin = estimateExListMin(exos);

        let iconPickerHtml = '<div class="editor-icon-picker">';
        iconKeys.forEach(k => {
            const isSel = k === activeIconKey;
            iconPickerHtml += `
                <button type="button" class="editor-icon-opt ${isSel ? 'selected' : ''}" onclick="selectEditorDayIcon(${dIdx}, '${k}')" title="Choisir cette icône">
                    ${DAY_ICONS_MAP[k]}
                </button>
            `;
        });
        iconPickerHtml += '</div>';

        html += `
            <div class="editor-day-card">
                <div class="editor-day-header">
                    <button type="button" class="editor-collapse-btn" onclick="toggleEditorDayCollapse('${day.id}')" title="${isCollapsed ? 'Déplier' : 'Replier'}">
                        <span class="editor-day-mini-icon">${getDayIcon(day)}</span>
                        <div class="editor-day-summary">
                            <div class="editor-day-summary-title">${escapeHTML(day.name || `Jour ${dIdx + 1}`)}</div>
                            <div class="editor-day-summary-sub">${escapeHTML(day.focus || 'Sans focus')} • ${exos.length} exo${exos.length > 1 ? 's' : ''} (~${estMin}m)</div>
                        </div>
                        <span class="editor-chevron ${isCollapsed ? '' : 'open'}">▾</span>
                    </button>
                    <div class="editor-day-actions">
                        <button class="editor-action-btn" onclick="editorMoveDay(${dIdx}, -1)" ${isFirstDay ? 'disabled' : ''} title="Monter">↑</button>
                        <button class="editor-action-btn" onclick="editorMoveDay(${dIdx}, 1)" ${isLastDay ? 'disabled' : ''} title="Descendre">↓</button>
                        <button class="editor-action-btn" onclick="editorDuplicateDay(${dIdx})" title="Dupliquer cette journée">${copySvg}</button>
                        <button class="editor-action-btn danger" onclick="editorRemoveDay(${dIdx})" title="Supprimer la journée">${trashSvg}</button>
                    </div>
                </div>

                <div class="editor-day-body ${isCollapsed ? 'hidden' : ''}">
                    <div class="editor-day-fields">
                        <input type="text" class="editor-input-bold" value="${escapeHTML(day.name)}" placeholder="Nom du jour (ex: Lundi, Push...)" 
                               oninput="editingProgram.days[${dIdx}].name = this.value">
                        <input type="text" class="editor-input-sub" value="${escapeHTML(day.focus)}" placeholder="Focus musculaire (ex: Pecs & Triceps)" 
                               oninput="editingProgram.days[${dIdx}].focus = this.value">
                    </div>

                    <div class="editor-icon-row">
                        <span class="editor-mini-label">Icône du jour :</span>
                        ${iconPickerHtml}
                    </div>
                    
                    <h4 class="editor-mini-label" style="margin-top: 14px; margin-bottom: 8px;">Exercices (${exos.length})</h4>
                    <div class="editor-ex-list">
        `;

        exos.forEach((ex, eIdx) => {
            const isFirstEx = eIdx === 0;
            const isLastEx = eIdx === exos.length - 1;

            html += `
                <div class="editor-ex-item">
                    <div class="editor-ex-top">
                        <span class="editor-ex-num">${eIdx + 1}</span>
                        <input type="text" class="editor-ex-name-input" value="${escapeHTML(ex.name)}" placeholder="Nom de l'exercice" 
                               oninput="editingProgram.exercises['${day.id}'][${eIdx}].name = this.value">
                        
                        <div class="editor-ex-move-group">
                            <button class="editor-ex-move-btn" onclick="editorMoveEx('${day.id}', ${eIdx}, -1)" ${isFirstEx ? 'disabled' : ''}>▲</button>
                            <button class="editor-ex-move-btn" onclick="editorMoveEx('${day.id}', ${eIdx}, 1)" ${isLastEx ? 'disabled' : ''}>▼</button>
                            <button class="editor-ex-del-btn" onclick="editorRemoveEx('${day.id}', ${eIdx})" title="Supprimer">✕</button>
                        </div>
                    </div>
                    <div class="editor-ex-controls">
                        <div class="editor-stepper-box">
                            <span class="editor-stepper-label">Séries</span>
                            <div class="editor-stepper-btns">
                                <button type="button" onclick="stepEditorEx('${day.id}', ${eIdx}, 'sets', -1)">−</button>
                                <input type="number" inputmode="numeric" value="${ex.sets}" 
                                       oninput="editingProgram.exercises['${day.id}'][${eIdx}].sets = parseInt(this.value) || 1">
                                <button type="button" onclick="stepEditorEx('${day.id}', ${eIdx}, 'sets', 1)">+</button>
                            </div>
                        </div>
                        <div class="editor-stepper-box">
                            <span class="editor-stepper-label">Repos (s)</span>
                            <div class="editor-stepper-btns">
                                <button type="button" onclick="stepEditorEx('${day.id}', ${eIdx}, 'rest', -15)">-15</button>
                                <input type="number" inputmode="numeric" value="${ex.rest}" step="15"
                                       oninput="editingProgram.exercises['${day.id}'][${eIdx}].rest = parseInt(this.value) || 0">
                                <button type="button" onclick="stepEditorEx('${day.id}', ${eIdx}, 'rest', 15)">+15</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        html += `
                    </div>
                    <div class="editor-add-ex-row">
                        <button class="btn-editor-catalog" onclick="openExercisePicker('${day.id}')">📚 Choisir dans le catalogue</button>
                        <button class="btn-editor-custom" onclick="editorAddEx('${day.id}')">+ Vide</button>
                    </div>
                </div>
            </div>
        `;
    });

    html += `
        </div>
        <button class="btn-add-set" style="margin-top: 20px; margin-bottom: 20px;" onclick="editorAddDay()">+ Ajouter une journée d'entraînement</button>
        
        <div style="position: sticky; bottom: 88px; z-index: 90;">
            <button class="btn-save-workout" style="margin-top: 0;" onclick="saveEditedProgram()">💾 Enregistrer le Programme</button>
        </div>
        <div style="height: 40px;"></div>
    `;

    mainContent.innerHTML = html;
}

/**
 * Monte ou descend une journée entière dans l'éditeur.
 */
window.editorMoveDay = function (index, dir) {
    moveItem(editingProgram.days, index, dir);
    renderProgramEditor(editingProgram.id);
};

/**
 * Monte ou descend un exercice au sein d'une journée dans l'éditeur.
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
        name: `Jour ${editingProgram.days.length + 1}`,
        focus: '',
        icon: 'dumbbell'
    });
    editingProgram.exercises[newId] = [];
    collapsedDays[newId] = false;
    renderProgramEditor(editingProgram.id);
};

/**
 * Supprime une journée entière (et tous ses exercices) du programme.
 */
window.editorRemoveDay = function (index) {
    showConfirm('Supprimer ce jour et tous ses exercices ?', () => {
        const dayId = editingProgram.days[index].id;
        editingProgram.days.splice(index, 1);
        delete editingProgram.exercises[dayId];
        renderProgramEditor(editingProgram.id);
    });
};

/**
 * Ajoute un nouvel exercice vide à une journée précise.
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
 */
window.editorRemoveEx = function (dayId, exIndex) {
    editingProgram.exercises[dayId].splice(exIndex, 1);
    renderProgramEditor(editingProgram.id);
};

/**
 * Enregistre le programme en cours d'édition dans le localStorage.
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
    showToast('Programme enregistré !');
    switchView('programs');
};

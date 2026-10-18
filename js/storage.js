// js/storage.js

const DAY_ICONS_MAP = {
    dumbbell: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6.5 6.5l11 11"></path>
        <path d="M21 21l-1-1"></path>
        <path d="M3 3l1 1"></path>
        <path d="M18 22l4-4"></path>
        <path d="M2 6l4-4"></path>
        <path d="M3 10l7-7"></path>
        <path d="M14 21l7-7"></path>
    </svg>`,
    pullup: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="2" y1="4" x2="22" y2="4"></line>
        <path d="M6 4v4l3 3v9"></path>
        <path d="M18 4v4l-3 3v9"></path>
        <circle cx="12" cy="7.5" r="2"></circle>
        <line x1="9" y1="14" x2="15" y2="14"></line>
    </svg>`,
    cardio: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path>
        <polyline points="8 12 10.5 12 12 9.5 13.5 14.5 15 12 16.5 12"></polyline>
    </svg>`,
    barbell: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <rect x="4" y="6" width="3" height="12" rx="1"></rect>
        <rect x="17" y="6" width="3" height="12" rx="1"></rect>
        <rect x="1.5" y="8" width="2.5" height="8" rx="0.5"></rect>
        <rect x="20" y="8" width="2.5" height="8" rx="0.5"></rect>
    </svg>`,
    upper: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="5" r="2.5"></circle>
        <path d="M5 11c-1.5 0-2.5-1.5-2-3 .4-1.2 1.8-1.5 2.5-.5L7 10h10l1.5-2.5c.7-1 2.1-.7 2.5.5.5 1.5-.5 3-2 3l-2 2-1 8H8l-1-8-2-2z"></path>
    </svg>`
};

/**
 * Retourne la clé d'icône correspondant à une journée (soit explicite, soit déduite du texte).
 * @param {Object} day - L'objet journée ({ id, name, focus, icon })
 * @returns {string} Clé de l'icône ('dumbbell' | 'pullup' | 'cardio' | 'barbell' | 'upper')
 */
function resolveDayIconKey(day) {
    if (day && day.icon && DAY_ICONS_MAP[day.icon]) {
        return day.icon;
    }
    const text = `${day?.name || ''} ${day?.focus || ''}`.toLowerCase();
    if (text.includes('cardio') || text.includes('course') || text.includes('hiit') || text.includes('vélo') || text.includes('velo')) return 'cardio';
    if (text.includes('jambe') || text.includes('quad') || text.includes('ischio') || text.includes('leg') || text.includes('squat') || text.includes('lower') || text.includes('bas')) return 'barbell';
    if (text.includes('dos') || text.includes('pull') || text.includes('traction') || text.includes('tirage')) return 'pullup';
    if (text.includes('full') || text.includes('haut') || text.includes('upper') || text.includes('épaule') || text.includes('epaule')) return 'upper';
    return 'dumbbell';
}

/**
 * Génère automatiquement une icône vectorielle SVG cohérente avec le focus musculaire de la journée.
 * @param {Object} day - L'objet journée ({ id, name, focus, icon })
 * @returns {string} Le code SVG de l'icône
 */
function getDayIcon(day) {
    return DAY_ICONS_MAP[resolveDayIconKey(day)] || DAY_ICONS_MAP.dumbbell;
}

/**
 * Retourne le programme classique (Split 4 Jours) généré par défaut.
 * @returns {Object} Le programme par défaut
 */
function getDefaultProgram() {
    return {
        id: 'standard_v1',
        name: 'Split 4 Jours (Standard)',
        days: [
            { id: 'lundi', name: 'Lundi', focus: 'Pecs & Triceps', icon: 'dumbbell' },
            { id: 'mardi', name: 'Mardi', focus: 'Dos & Biceps', icon: 'pullup' },
            { id: 'mercredi', name: 'Mercredi', focus: 'Cardio (1 sur 2)', icon: 'cardio' },
            { id: 'jeudi', name: 'Jeudi', focus: 'Jambes (Quadri & Ischios)', icon: 'barbell' },
            { id: 'vendredi', name: 'Vendredi', focus: 'Full Haut du Corps', icon: 'upper' }
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

/**
 * Récupère tous les programmes personnalisés enregistrés sur l'appareil.
 * Gère également la rétrocompatibilité avec l'ancienne clé localStorage 'my_custom_programs'.
 * @returns {Array} Liste des programmes
 */
function getMyPrograms() {
    let programs = JSON.parse(localStorage.getItem('all_custom_programs'));
    if (!programs) {
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

/**
 * Récupère le programme défini comme "actif" par l'utilisateur courant.
 * S'il n'y en a pas, active le premier programme de la liste globale.
 * @returns {Object} Le programme actif
 */
function getActiveProgram() {
    const programs = getMyPrograms();
    let activeId = localStorage.getItem(getKey('active_program_id'));

    let active = programs.find(p => p.id === activeId);
    if (!active) {
        active = programs[0];
        localStorage.setItem(getKey('active_program_id'), active.id);
    }
    return active;
}

/**
 * Renvoie la liste des jours d'entraînement du programme actif.
 * @returns {Array} Tableau d'objets (journées)
 */
function getProgDays() { return getActiveProgram().days; }

/**
 * Renvoie la liste des exercices prévus pour un jour donné.
 * @param {string} dayId - Identifiant de la journée (ex: "lundi")
 * @returns {Array} Tableau d'exercices
 */
function getProgExo(dayId) { return getActiveProgram().exercises[dayId] || []; }

/**
 * Renvoie une clé localStorage préfixée par l'ID de l'utilisateur courant pour garantir l'isolation des données.
 * @param {string} name - Nom de la variable
 * @returns {string} Clé préfixée
 */
function getKey(name) {
    return `${currentUserId}_${name}`;
}

/**
 * Récupère la liste de tous les profils (utilisateurs) inscrits sur cet appareil.
 * @returns {Array} Tableau de profils
 */
function getSavedProfiles() {
    return JSON.parse(localStorage.getItem('all_saved_profiles')) || [];
}

/**
 * Sauvegarde un nouveau profil dans le registre global.
 * @param {string} name - Nom à afficher
 * @param {string} userId - Identifiant unique généré
 */
function saveProfile(name, userId) {
    const profiles = getSavedProfiles();
    const existing = profiles.find(p => p.id === userId);
    if (!existing) {
        profiles.push({ id: userId, name: name });
        localStorage.setItem('all_saved_profiles', JSON.stringify(profiles));
    }
}

/**
 * Télécharge un fichier JSON contenant l'intégralité du localStorage de l'appareil.
 * Utile pour sauvegarder et migrer ses historiques et programmes.
 */
window.exportAllData = function() {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        data[key] = localStorage.getItem(key);
    }
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mon_programme_sauvegarde_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    if (typeof showToast !== 'undefined') showToast('Sauvegarde téléchargée');
};

/**
 * Lit un fichier JSON de sauvegarde et remplace complètement le contenu
 * du localStorage avec ces données. L'application se recharge si succès.
 * @param {Event} event - L'évènement du tag <input type="file">
 */
window.importAllData = function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (!data || typeof data !== 'object') throw new Error("Fichier invalide");
            
            const msg = "⚠️ ATTENTION : La restauration de ce fichier remplacera définitivement TOUTES vos données actuelles sur cet appareil. Voulez-vous continuer ?";
            
            if (typeof showConfirm !== 'undefined') {
                showConfirm(msg, () => doRestore(data));
            } else if (confirm(msg)) {
                doRestore(data);
            }
        } catch (err) {
            alert("Erreur lors de la lecture du fichier de sauvegarde. Assurez-vous qu'il s'agit d'un fichier valide.");
            console.error(err);
        }
        event.target.value = '';
    };
    reader.readAsText(file);
};

function doRestore(data) {
    localStorage.clear();
    for (let key in data) {
        localStorage.setItem(key, data[key]);
    }
    alert("Restauration réussie ! L'application va se recharger avec vos données.");
    window.location.reload();
}

/**
 * Récupère les notes enregistrées par l'utilisateur pour chaque exercice.
 * @returns {Object} Dictionnaire { [exId]: "note" }
 */
function getExerciseNotes() {
    return JSON.parse(localStorage.getItem(getKey('my_exercise_notes'))) || {};
}

/**
 * Sauvegarde une note pour un exercice spécifique.
 * @param {string} exId - L'identifiant de l'exercice
 * @param {string} note - Le contenu de la note
 */
window.saveExerciseNote = function(exId, note) {
    const notes = getExerciseNotes();
    if (note && note.trim()) {
        notes[exId] = note.trim();
    } else {
        delete notes[exId];
    }
    localStorage.setItem(getKey('my_exercise_notes'), JSON.stringify(notes));
};

/**
 * Calcule le meilleur 1RM et la meilleure charge historiques pour un exercice donné (hors séance en cours).
 * @param {string} exId - L'identifiant de l'exercice
 * @param {number|null} excludeSessionId - ID de séance à exclure (utile pour l'affichage dans l'historique)
 * @returns {{max1RM: number, maxKg: number}} Les records historiques de l'exercice
 */
function getHistoricalBest(exId, excludeSessionId = null) {
    let max1RM = 0;
    let maxKg = 0;
    (historyData || []).forEach(session => {
        if (excludeSessionId && String(session.id) === String(excludeSessionId)) return;
        const sets = session.data && session.data[exId];
        if (!sets) return;
        sets.forEach(s => {
            if (s.checked && s.kg && s.reps) {
                const w = parseFloat(s.kg);
                const oneRm = calcOneRM(w, s.reps);
                if (w > maxKg) maxKg = w;
                if (oneRm > max1RM) max1RM = oneRm;
            }
        });
    });
    return { max1RM, maxKg };
}

/**
 * Duplique un programme existant et l'ajoute à la liste des programmes.
 * @param {string} progId - L'ID du programme à dupliquer
 */
window.duplicateProgram = function(progId) {
    const programs = getMyPrograms();
    const orig = programs.find(p => p.id === progId);
    if (!orig) return;

    const copy = JSON.parse(JSON.stringify(orig));
    copy.id = 'prog_' + Date.now();
    copy.name = orig.name + ' (Copie)';
    programs.push(copy);
    localStorage.setItem('all_custom_programs', JSON.stringify(programs));
    showToast('Programme dupliqué');
    renderProgramsList();
};

/**
 * Exporte uniquement un programme spécifique en fichier JSON pour le partager.
 * @param {string} progId - L'ID du programme à exporter
 */
window.exportSingleProgram = function(progId) {
    const programs = getMyPrograms();
    const prog = programs.find(p => p.id === progId);
    if (!prog) return;

    const payload = { _type: 'single_program_v3', program: prog };
    const json = JSON.stringify(payload, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeName = prog.name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    a.download = `programme_${safeName}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Programme exporté');
};

/**
 * Importe un programme individuel depuis un fichier JSON sans écraser les autres données.
 * @param {Event} event - L'événement du champ file
 */
window.importSingleProgram = function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const parsed = JSON.parse(e.target.result);
            const prog = parsed.program || (parsed.days && parsed.exercises ? parsed : null);
            if (!prog || !Array.isArray(prog.days) || !prog.exercises) {
                throw new Error('Format de programme invalide');
            }
            const programs = getMyPrograms();
            const newProg = JSON.parse(JSON.stringify(prog));
            newProg.id = 'prog_' + Date.now();
            if (programs.some(p => p.name === newProg.name)) {
                newProg.name += ' (Importé)';
            }
            programs.push(newProg);
            localStorage.setItem('all_custom_programs', JSON.stringify(programs));
            showToast('Programme importé !');
            renderProgramsList();
        } catch (err) {
            alert("Fichier invalide. Assurez-vous d'importer un fichier de programme JSON valide.");
            console.error(err);
        }
        event.target.value = '';
    };
    reader.readAsText(file);
};


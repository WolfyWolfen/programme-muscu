// js/storage.js

/**
 * Retourne le programme classique (Split 4 Jours) généré par défaut.
 * @returns {Object} Le programme par défaut
 */
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

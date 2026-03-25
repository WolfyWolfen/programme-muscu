// js/state.js

let currentUserId = localStorage.getItem('my_user_id') || null;

let currentView = 'home';
let activeWorkoutDay = null;
let currentWorkoutData = {};
let historyData = [];

let audioCtx = null;
let audioUnlocked = false;

/**
 * Initialise (ou retourne) le contexte audio global unique (singleton).
 * @returns {AudioContext} Le contexte audio natif
 */
function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

/**
 * Déverrouille l'audio sur iOS lors de la première interaction utilisateur ("touch" initial).
 */
function unlockAudio() {
    if (audioUnlocked) return;
    const ctx = getAudioContext();
    ctx.resume().then(() => { audioUnlocked = true; });
    document.removeEventListener('touchstart', unlockAudio);
    document.removeEventListener('click', unlockAudio);
}
document.addEventListener('touchstart', unlockAudio, { once: true });
document.addEventListener('click', unlockAudio, { once: true });

/**
 * Valide la création ou la sélection d'un profil utilisateur.
 * @param {string|null} forcedName - Nom forcé (utile si appelé programmatiquement depuis un bouton existant)
 */
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

/**
 * Ouvre la modale permettant de changer de profil utilisateur actif.
 */
window.switchProfile = function () {
    document.getElementById('profile-overlay').classList.remove('hidden');
    renderProfileModal();
};

/**
 * Supprime complètement un profil et toutes ses données associées (historique, programmes) du localStorage.
 * @param {string} userId - L'ID de l'utilisateur à supprimer
 */
window.deleteProfile = function (userId) {
    showConfirm("Êtes-vous sûr de vouloir supprimer définitivement ce profil et TOUTES ses données (programmes, historique, etc.) ?", () => {
        let profiles = getSavedProfiles();
        if (!userId || !profiles.find(p => p.id === userId)) return;
        
        profiles = profiles.filter(p => p.id !== userId);
        localStorage.setItem('all_saved_profiles', JSON.stringify(profiles));

        const prefix = userId + '_';
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(prefix)) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));

        if (currentUserId === userId) {
            localStorage.removeItem('my_user_id');
            currentUserId = null;
            window.location.reload();
            return;
        }

        if (profiles.length === 0) {
            window.location.reload();
        } else {
            renderProfileModal();
        }
    });
}

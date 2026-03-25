// js/utils.js

/**
 * Échappe les caractères HTML spéciaux pour prévenir les failles XSS.
 * @param {string} str - La chaîne à échapper
 * @returns {string} La chaîne sécurisée
 */
function escapeHTML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Formate une durée en secondes en format mm:ss ou hh:mm:ss.
 * @param {number} sec - La durée en secondes
 * @returns {string} La durée formatée
 */
function formatDuration(sec) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
}

/**
 * Affiche une petite notification (toast) éphémère en bas de l'écran.
 * @param {string} [msg] - Le message à afficher
 */
function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg || 'Sauvegardé avec succès';
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

/**
 * Affiche une modale de confirmation personnalisée (remplace window.confirm pour une meilleure UI/UX).
 * @param {string} message - Le texte de la question
 * @param {Function} onConfirm - Le callback exécuté si l'utilisateur valide
 */
function showConfirm(message, onConfirm) {
    const existing = document.getElementById('confirm-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'confirm-modal';
    modal.innerHTML = `
        <div class="confirm-backdrop"></div>
        <div class="confirm-box">
            <p>${escapeHTML(message)}</p>
            <div class="confirm-btns">
                <button class="confirm-cancel">Annuler</button>
                <button class="confirm-ok">Confirmer</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('.confirm-cancel').onclick = () => modal.remove();
    modal.querySelector('.confirm-backdrop').onclick = () => modal.remove();
    modal.querySelector('.confirm-ok').onclick = () => {
        modal.remove();
        onConfirm();
    };
}

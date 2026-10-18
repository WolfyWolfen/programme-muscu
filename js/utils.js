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

/**
 * Calcule le 1RM estimé via la formule d'Epley : Poids * (1 + Reps / 30).
 * @param {number|string} kg - Le poids soulevé
 * @param {number|string} reps - Le nombre de répétitions
 * @returns {number} Le 1RM estimé (arrondi à 1 décimale)
 */
function calcOneRM(kg, reps) {
    const w = parseFloat(kg);
    const r = parseInt(reps);
    if (!w || w <= 0 || !r || r <= 0) return 0;
    if (r === 1) return w;
    return Math.round(w * (1 + r / 30) * 10) / 10;
}

/**
 * Ouvre une modale "Calculateur de disques" pour un poids cible donné (barre olympique 20kg par défaut).
 * @param {number|string} initialWeight - Le poids total souhaité
 */
window.openPlateCalculator = function(initialWeight = 60) {
    const existing = document.getElementById('plate-modal');
    if (existing) existing.remove();

    const w = parseFloat(initialWeight) || 60;
    const modal = document.createElement('div');
    modal.id = 'plate-modal';
    modal.innerHTML = `
        <div class="confirm-backdrop"></div>
        <div class="confirm-box" style="width: 340px;">
            <h3 style="color: var(--primary); margin-bottom: 12px; font-size: 18px;">🧮 Calculateur de Disques</h3>
            <div style="display: flex; gap: 8px; margin-bottom: 12px; align-items: center;">
                <div style="flex: 1; text-align: left;">
                    <label style="font-size: 11px; color: var(--text-sec);">Poids Total (kg)</label>
                    <input type="number" id="plate-total-input" step="0.5" value="${w}" style="width: 100%; padding: 8px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: var(--bg); color: var(--text); font-size: 16px; font-weight: bold; text-align: center; margin-top: 4px;">
                </div>
                <div style="flex: 1; text-align: left;">
                    <label style="font-size: 11px; color: var(--text-sec);">Barre (kg)</label>
                    <input type="number" id="plate-bar-input" step="1" value="20" style="width: 100%; padding: 8px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: var(--bg); color: var(--text); font-size: 16px; font-weight: bold; text-align: center; margin-top: 4px;">
                </div>
            </div>
            <div id="plate-result" style="background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 12px; margin-bottom: 16px; min-height: 60px; display: flex; flex-direction: column; justify-content: center; gap: 6px;"></div>
            <button class="confirm-cancel" style="width: 100%;">Fermer</button>
        </div>
    `;
    document.body.appendChild(modal);

    const updateCalc = () => {
        const total = parseFloat(document.getElementById('plate-total-input').value) || 0;
        const bar = parseFloat(document.getElementById('plate-bar-input').value) || 0;
        const resEl = document.getElementById('plate-result');
        if (total <= bar) {
            resEl.innerHTML = `<span style="color: var(--text-sec); font-size: 13px;">Barre seule (${bar} kg)</span>`;
            return;
        }
        let perSide = (total - bar) / 2;
        const plates = [25, 20, 15, 10, 5, 2.5, 1.25];
        const needed = [];
        for (const p of plates) {
            const count = Math.floor((perSide + 0.001) / p);
            if (count > 0) {
                needed.push(`<span class="plate-badge">${count} × <b>${p}kg</b></span>`);
                perSide = Math.round((perSide - count * p) * 100) / 100;
            }
        }
        resEl.innerHTML = `
            <div style="font-size: 12px; color: var(--text-sec);">Par côté (${(total - bar) / 2} kg) :</div>
            <div style="display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; margin-top: 4px;">
                ${needed.length > 0 ? needed.join('') : '<span style="font-size:13px; color:var(--text-sec);">Aucun disque standard</span>'}
            </div>
            ${perSide > 0 ? `<div style="font-size: 11px; color: var(--secondary); margin-top: 4px;">Reste non couvert : ${perSide} kg / côté</div>` : ''}
        `;
    };

    document.getElementById('plate-total-input').oninput = updateCalc;
    document.getElementById('plate-bar-input').oninput = updateCalc;
    modal.querySelector('.confirm-cancel').onclick = () => modal.remove();
    modal.querySelector('.confirm-backdrop').onclick = () => modal.remove();
    updateCalc();
};

let wakeLockSentinel = null;

/**
 * Active ou désactive le maintien de l'écran allumé (Screen Wake Lock API) pendant une séance.
 * @param {boolean} enable - true pour activer, false pour libérer
 */
async function setWakeLock(enable) {
    if (!('wakeLock' in navigator)) return;
    try {
        if (enable && !wakeLockSentinel) {
            wakeLockSentinel = await navigator.wakeLock.request('screen');
            wakeLockSentinel.addEventListener('release', () => { wakeLockSentinel = null; });
        } else if (!enable && wakeLockSentinel) {
            await wakeLockSentinel.release();
            wakeLockSentinel = null;
        }
    } catch (e) {
        // Ignoré silencieusement si refusé par le navigateur ou batterie faible
    }
}
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && typeof currentView !== 'undefined' && currentView === 'workout') {
        setWakeLock(true);
    }
});


const APP_VERSION = 'v3.3.2'; // Mettre à jour à chaque modif majeure
// =============================================
// INITIALISATION
// =============================================
let listenersInitialized = false;

if (typeof applyAppTheme === 'function' && typeof getCurrentTheme === 'function') {
    applyAppTheme(getCurrentTheme());
}

function initApp() {
    historyData = JSON.parse(localStorage.getItem(getKey('my_workout_history'))) || [];
    if (typeof applyAppTheme === 'function' && typeof getCurrentTheme === 'function') {
        applyAppTheme(getCurrentTheme());
    }

    // Afficher le nom du profil et le sélecteur de thème dans le header
    let actionsRow = document.getElementById('header-actions-row');
    if (!actionsRow) {
        actionsRow = document.createElement('div');
        actionsRow.id = 'header-actions-row';
        actionsRow.className = 'header-actions-row';
        document.querySelector('.header-content').appendChild(actionsRow);
    }

    let profileBtn = document.getElementById('profile-switch-btn');
    const btnHtml = `<span>${escapeHTML(currentUserId.replace(/_/g, ' '))}</span> <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;

    if (!profileBtn) {
        profileBtn = document.createElement('button');
        profileBtn.id = 'profile-switch-btn';
        profileBtn.className = 'profile-switch-btn';
        profileBtn.title = 'Changer de profil';
        profileBtn.onclick = switchProfile;
        actionsRow.appendChild(profileBtn);
    }
    profileBtn.innerHTML = btnHtml;

    let themeBtn = document.getElementById('theme-switch-btn');
    if (!themeBtn) {
        themeBtn = document.createElement('button');
        themeBtn.id = 'theme-switch-btn';
        themeBtn.className = 'theme-switch-btn';
        themeBtn.title = 'Changer le thème de couleur';
        themeBtn.onclick = openThemeModal;
        themeBtn.innerHTML = `<span class="theme-dot-preview"></span><span>Thème</span>`;
        actionsRow.appendChild(themeBtn);
    }

    // Ajouter les listeners une seule fois
    if (!listenersInitialized) {
        navBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                switchView(view);
            });
        });
        backBtn.addEventListener('click', () => switchView('home'));
        listenersInitialized = true;
    }

    switchView('home');
}

// Appui Entrée sur l'input de profil
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('profile-name-input');
    if (input) input.addEventListener('keydown', e => { if (e.key === 'Enter') window.confirmProfile(); });
});

// Lancement au démarrage
if (currentUserId) {
    const profiles = getSavedProfiles();
    const exists = profiles.find(p => p.id === currentUserId);
    if (!exists) saveProfile(currentUserId.replace(/_/g, ' '), currentUserId);

    initApp();
} else {
    document.getElementById('profile-overlay').classList.remove('hidden');
    renderProfileModal();
    const input = document.getElementById('profile-name-input');
    if (input) setTimeout(() => input.focus(), 100);
}

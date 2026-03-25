const APP_VERSION = 'v3.0.1'; // Mettre à jour à chaque modif majeure
// =============================================
// INITIALISATION
// =============================================
let listenersInitialized = false;

function initApp() {
    historyData = JSON.parse(localStorage.getItem(getKey('my_workout_history'))) || [];

    // Afficher le nom du profil et le lien changer dans le header
    let profileBtn = document.getElementById('profile-switch-btn');
    const btnHtml = `<span>${escapeHTML(currentUserId.replace(/_/g, ' '))}</span> <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;

    if (!profileBtn) {
        profileBtn = document.createElement('button');
        profileBtn.id = 'profile-switch-btn';
        profileBtn.className = 'profile-switch-btn';
        profileBtn.title = 'Changer de profil';
        profileBtn.onclick = switchProfile;
        document.querySelector('.header-content').appendChild(profileBtn);
    }
    profileBtn.innerHTML = btnHtml;

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

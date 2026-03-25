// js/storage.js

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

// Récupère TOUS les programmes (Globaux)
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

// Récupère LE programme actuellement sélectionné
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

function getProgDays() { return getActiveProgram().days; }
function getProgExo(dayId) { return getActiveProgram().exercises[dayId] || []; }

function getKey(name) {
    return `${currentUserId}_${name}`;
}

function getSavedProfiles() {
    return JSON.parse(localStorage.getItem('all_saved_profiles')) || [];
}

function saveProfile(name, userId) {
    const profiles = getSavedProfiles();
    const existing = profiles.find(p => p.id === userId);
    if (!existing) {
        profiles.push({ id: userId, name: name });
        localStorage.setItem('all_saved_profiles', JSON.stringify(profiles));
    }
}

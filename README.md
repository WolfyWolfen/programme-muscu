# 💪 Mon Programme — PWA Musculation

> **Version 1.5** · [Ouvrir l'application](https://wolfywolfen.github.io/programme-muscu/)

Application web progressive (PWA) de suivi d'entraînement musculaire. Accessible sur Android et iOS, installable comme une app native, **sans compte ni connexion**, fonctionne 100% hors-ligne.

---

## ✨ Fonctionnalités

- **Programme sur 5 jours** — Pecs/Triceps · Dos/Biceps · Cardio · Jambes · Full Haut du corps
- **Suivi des séries** — Poids & reps pré-remplis depuis votre dernière séance
- **Chrono de repos** — Temps automatique et adapté par exercice (60s à 2min30)
- **Chrono de séance** — Démarrage manuel, durée enregistrée dans l'historique
- **Historique complet** — Suppression par séance, exercice ou série isolée
- **Durée estimée** — Affichée sur chaque journée dans l'accueil
- **Multi-profils** — Données isolées par prénom, pas de mélange entre utilisateurs
- **100% offline** — Service Worker + cache, aucune connexion requise après le 1er chargement
- **Mise à jour automatique** — Les nouveaux exercices/corrections arrivent sans action de l'utilisateur

---

## 📱 Installation

### 🤖 Android (Chrome) — [Guide complet](MANUEL_ANDROID.md)
1. Ouvrir l'URL dans **Chrome**
2. Menu ⋮ → *Ajouter à l'écran d'accueil*

### 🍎 iOS (Safari) — [Guide complet](MANUEL_IOS.md)
1. Ouvrir l'URL dans **Safari** (pas Chrome)
2. Icône Partager 📤 → *Sur l'écran d'accueil*

---

## 🗓 Programme

| Jour | Séance | Durée |
|------|--------|-------|
| Lundi | Pecs & Triceps — développé couché, incliné haltères, dips | ~43 min |
| Mardi | Dos & Biceps — tractions, rowing barre, tirage poitrine | ~42 min |
| Mercredi | Cardio (1 semaine sur 2) | 30–45 min |
| Jeudi | Jambes — Squat, Leg Extension, Fentes, RDL, Leg Curl | ~45 min |
| Vendredi | Full Haut du Corps — épaules, pecs, dos, bras | ~42 min |

---

## 🛠 Stack technique

`HTML` · `CSS` · `JavaScript vanilla` · `localStorage` · `Service Worker` · `PWA Manifest`

---

## 🔒 Confidentialité

Toutes les données sont stockées **localement sur votre appareil** (localStorage). Aucune donnée n'est envoyée à un serveur. Chaque profil utilisateur a son propre espace de stockage isolé.

---

## 🔄 Mettre à jour l'application (pour les développeurs)

1. Modifier le code source (`app.js`, `style.css`, `index.html`...)
2. Ouvrir `sw.js` et incrémenter `CACHE_NAME` (ex: `v1.5` → `v1.6`)
3. Faire de même pour `APP_VERSION` dans `app.js`
4. `git add . && git commit -m "Version X.Y" && git push`

Les utilisateurs recevront la mise à jour automatiquement au prochain lancement de l'application.

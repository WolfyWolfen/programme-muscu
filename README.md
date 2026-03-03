# 💪 Mon Programme — PWA Musculation

> **Version 1.6** · [Ouvrir l'application](https://wolfywolfen.github.io/programme-muscu/)

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

## 📱 Comment installer l'application (PWA)

Cette application n'est pas sur les stores classiques (Play Store / App Store). Il s'agit d'une **Progressive Web App (PWA)**. Vous l'installez directement depuis votre navigateur, et elle se comportera ensuite 100% comme une application native (icône sur l'écran d'accueil, plein écran, hors-ligne).

### 🤖 Android (Recommandé avec Chrome) — [Voir le guide illustré](MANUEL_ANDROID.md)
1. Ouvrez ce lien dans **Chrome** sur votre téléphone : [https://wolfywolfen.github.io/programme-muscu/](https://wolfywolfen.github.io/programme-muscu/)
2. Appuyez sur les **3 petits points ⋮** en haut à droite du navigateur.
3. Appuyez sur **Ajouter à l'écran d'accueil** (ou "Installer l'application").
4. Confirmez, et l'icône "Mon Programme" s'ajoutera à vos applications !

### 🍎 iOS (Obligatoire avec Safari) — [Voir le guide illustré](MANUEL_IOS.md)
1. Ouvrez ce lien **uniquement dans Safari** (l'installation PWA est bloquée par Apple sur les autres navigateurs) : [https://wolfywolfen.github.io/programme-muscu/](https://wolfywolfen.github.io/programme-muscu/)
2. Appuyez sur le bouton **Partager** 📤 (le carré avec la flèche vers le haut, en bas de l'écran).
3. Faites défiler vers le bas et appuyez sur **Sur l'écran d'accueil** (bouton avec un petit "+" encadré).
4. Appuyez sur **Ajouter** en haut à droite. L'app est maintenant installée !

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
2. Ouvrir `sw.js` et incrémenter `CACHE_NAME` (ex: `v1.6` → `v1.7`)
3. Faire de même pour `APP_VERSION` dans `app.js`
4. `git add . && git commit -m "Version X.Y" && git push`

Les utilisateurs recevront la mise à jour automatiquement au prochain lancement de l'application.

---

## 📜 Historique des versions (Changelog)

- **v1.6** : Correction du crash écran blanc au rechargement (F5) lié à la *Temporal Dead Zone* du navigateur (`ReferenceError` sur `APP_VERSION`).
- **v1.5** : Désactivation du `pull-to-refresh` Android natif (`overscroll-behavior: none`) pour empêcher la recharge accidentelle et la perte d'état en glissant vers le bas.
- **v1.4** : Audit de code. Correction d'un bug où les listeners de navigation pouvaient se dupliquer suite à de multiples appels d'initialisation.
- **v1.3** : Ajout de la mécanique de mise à jour transparente du Service Worker (`skipWaiting` et `clients.claim`). Plus besoin de fermer l'app manuellement pour appliquer une nouvelle version !
- **v1.2** : Affichage dynamique de la version (`vX.Y`) en bas de l'écran Programme et refonte de la gestion du cache SW.
- **v1.1** : Ajout des guides d'installation officiels (MANUEL_IOS, MANUEL_ANDROID) et premières métadonnées PWA (`manifest.json`, icones).
- **v1.0** : Lancement initial. Programme 5 jours, timers, isolations localStorage multi-profils et stockage hors-ligne basique.


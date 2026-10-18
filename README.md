# 💪 Ma Séance — Suivi & Progression (PWA Musculation)

> **Version 3.3.3** · [Ouvrir l'application](https://wolfywolfen.github.io/programme-muscu/)

Application web progressive (PWA) de suivi d'entraînement musculaire. Accessible sur Android et iOS, installable comme une app native, **sans compte ni connexion**, fonctionne 100% hors-ligne.

---

## ✨ Fonctionnalités

- **Créateur & Partage de Programmes** — Catalogue intégré (+50 exercices classés par muscle), templates rapides (*PPL, Upper/Lower, Full Body*), accordéons, duplication et export/import individuel en `.json`
- **Surcharge Progressive & Records (PR)** — Rappel de la séance précédente sous chaque série, boutons rapides `-1 / +1 rep`, calcul du 1RM estimé (Epley), détection automatique des PR 🏆 et notes persistantes par exercice
- **6 Thèmes de Couleurs Personnalisables** — *Cyan Cyber, Rouge Titan, Émeraude, Or Olympique, Ultra Violet, Bleu Glace* mémorisés par profil
- **Statistiques Avancées** — Courbe de progression par exercice (Charge & 1RM), calendrier d'assiduité (28 jours), série de semaines (*Streak* 🔥) et volume global
- **Confort Mobile & Anti-veille** — Maintien de l'écran allumé (*Wake Lock*), chronos basés sur l'horloge système (résistants à la mise en veille), calculateur de disques 🧮 et barre de progression de séance
- **Multi-profils & Isolation** — Données et thème strictement liés au profil choisi, sans mélange
- **Historique complet** — Suppression par séance, exercice ou série isolée
- **100% offline & Mise à jour automatique** — Service Worker + cache avec rechargement transparent dès qu'une nouvelle version est publiée

---

## 📱 Comment installer l'application (PWA)

Cette application n'est pas sur les stores classiques (Play Store / App Store). Il s'agit d'une **Progressive Web App (PWA)**. Vous l'installez directement depuis votre navigateur, et elle se comportera ensuite 100% comme une application native (icône sur l'écran d'accueil, plein écran, hors-ligne).

### 🤖 Android (Recommandé avec Chrome) — [Voir le guide illustré](MANUEL_ANDROID.md)
1. Ouvrez ce lien dans **Chrome** sur votre téléphone : [https://wolfywolfen.github.io/programme-muscu/](https://wolfywolfen.github.io/programme-muscu/)
2. Appuyez sur les **3 petits points ⋮** en haut à droite du navigateur.
3. Appuyez sur **Ajouter à l'écran d'accueil** (ou "Installer l'application").
4. Confirmez, et l'icône **"Ma Séance"** s'ajoutera à vos applications !

### 🍎 iOS (Obligatoire avec Safari) — [Voir le guide illustré](MANUEL_IOS.md)
1. Ouvrez ce lien **uniquement dans Safari** (l'installation PWA est bloquée par Apple sur les autres navigateurs) : [https://wolfywolfen.github.io/programme-muscu/](https://wolfywolfen.github.io/programme-muscu/)
2. Appuyez sur le bouton **Partager** 📤 (le carré avec la flèche vers le haut, en bas de l'écran).
3. Faites défiler vers le bas et appuyez sur **Sur l'écran d'accueil** (bouton avec un petit "+" encadré).
4. Appuyez sur **Ajouter** en haut à droite. L'app est maintenant installée !

---

## 🗓 Programmes (100% Personnalisables)

L'application repose sur un système dynamique : **vous n'êtes plus limité à un programme pré-défini**. 
Vous pouvez accéder au gestionnaire (icône ⚙️) pour créer une infinité de programmes selon vos objectifs (PPL, Split, Full Body, Force, etc).
  
Lors de la toute première utilisation, l'application génèrera un programme par défaut, le classique **Split 4 Jours (Standard)** :
- **Lundi** : Pecs & Triceps
- **Mardi** : Dos & Biceps
- **Mercredi** : Cardio (Optionnel)
- **Jeudi** : Jambes (Quadri & Ischios)
- **Vendredi** : Full Haut du Corps

Ce programme n'est qu'un point de départ. Vous êtes libre de le supprimer, de l'éditer ou de créer le vôtre de A à Z (Nom du jour, Icône, Exercices du catalogue ou personnalisés, Séries et Repos) !

---

## 🛠 Stack & Architecture Modulaire

`HTML5` · `CSS3 Modulaire` · `JavaScript Vanilla (ES6+)` · `localStorage` · `Service Worker` · `PWA Manifest`

- **`css/`** :
  - `variables.css` : Variables `:root`, thèmes de couleurs (`[data-theme]`) et animations
  - `layout.css` : Structure `#app`, en-tête, navigation flottante, toasts et modales centrées
  - `home.css` : Bannière du programme actif, cartes des journées et badges
  - `workout.css` : Séance active, séries/reps, steppers, chronomètres et calculateur de disques
  - `stats-history.css` : Historique, calendrier d'assiduité (heatmap 28j) et graphiques
  - `editor.css` : Créateur de programme, accordéons, templates et catalogue d'exercices
- **`js/`** :
  - `utils.js`, `storage.js`, `state.js`, `ui.js`, `editor.js`, `workout.js` + `app.js`

---

## 🔒 Confidentialité

Toutes les données sont stockées **localement sur votre appareil** (localStorage). Aucune donnée n'est envoyée à un serveur. Chaque profil utilisateur a son propre espace de stockage isolé.

---

## 🔄 Mettre à jour l'application (pour les développeurs)

1. Modifier le code source (`app.js`, `js/*.js`, `css/*.css`, `index.html`...)
2. Ouvrir `sw.js` et incrémenter `CACHE_NAME` (ex: `v3.3.2` → `v3.3.3`)
3. Faire de même pour `APP_VERSION` dans `app.js`
4. `git add . && git commit -m "Version X.Y.Z" && git push`

Les utilisateurs recevront la mise à jour automatiquement au prochain lancement de l'application (ou en touchant le numéro de version en bas de l'accueil).

---

## 📜 Historique des versions (Changelog)

- **v3.3.3 : Architecture CSS Modulaire** :
  - Découpage de l'ancien `style.css` (2 200+ lignes) en 6 fichiers thématiques dans `css/` (`variables.css`, `layout.css`, `home.css`, `workout.css`, `stats-history.css`, `editor.css`) et centrage fixe de la modale de thème.
- **v3.3.2 : Thèmes de Couleurs Personnalisables** :
  - Ajout d'un sélecteur de thème dans l'en-tête avec **6 palettes complètes** (*Cyan Cyber, Rouge Titan, Émeraude, Or Olympique, Ultra Violet, Bleu Glace*) sauvegardées par profil.
- **v3.3.1 : Identité "Ma Séance"** :
  - Renommage de l'application en **Ma Séance — Suivi & Progression** (`index.html`, `manifest.json`, `ui.js`).
- **v3.3.0 : Créateur de Programme Avancé (Catalogue, Modèles & Accordéons)** :
  - **Catalogue d'exercices intégré (`📚`)** : Plus de 50 exercices classés par groupe musculaire avec barre de recherche instantanée. Conserve les mêmes identifiants (`id`) entre vos différents programmes pour que votre historique de poids et vos PR suivent automatiquement.
  - **Modèles rapides (`⚡`)** : Chargement en 1 clic des structures **PPL (3j)**, **Upper / Lower (4j)** ou **Full Body (3j)**.
  - **Confort d'édition** : Journées pliables/dépliables en accordéon avec estimation de durée en direct, duplication d'une journée entière ou d'un exercice, sélecteur visuel d'icône sportive par jour et boutons tactiles `- / +` sur les séries et temps de repos (`-15s / +15s`).
- **v3.2.1 à v3.2.6** : Hotfix mobile pour la largeur de la case `REPS`, ajout des boutons `-1 rep` (rouge) / `+1 rep` (cyan) alignés sous `REPS`, affichage sur 2 lignes de la performance précédente, icônes sportives SVG cohérentes par jour et rechargement forcé du cache Service Worker.
- **v3.2.0 : Refonte Esthétique Glassmorphism & Animations** :
  - **Design & Lumière** : Fond atmosphérique avec halos cyan/violet, cartes en verre dépoli (*glassmorphism*) avec bordures spéculaires et barre de navigation flottante en capsule (*Floating Pill Dock*).
  - **Animations & Retours Visuels** : Apparition fluide en cascade des cartes, mise en lumière complète des séries cochées, badge `✓ Terminé` quand un exercice est complété et jauge de progression visuelle sur le chronomètre de repos.
  - **Accueil enrichi** : Affichage du nombre d'exercices et de la date relative de dernière séance (*Fait aujourd'hui / Il y a X j*) sur chaque journée, et remplacement des emojis techniques par des icônes vectorielles SVG.
- **v3.1.0 : Surcharge Progressive, Stats par Exercice & Confort Mobile** :
  - **Séance** : Affichage de la performance précédente sous chaque série, détection automatique des Records Personnels (`🏆 PR`) et du Max historique, notes persistantes par exercice, bouton rapide `+1 rep`, calculateur de disques (`🧮`), barre de progression en direct et maintien de l'écran allumé (*Screen Wake Lock*).
  - **Chronomètres** : Timer de repos recalibré sur l'horloge système (insensible à la mise en veille du téléphone) et démarrage automatique du chrono de séance dès la première série validée.
  - **Statistiques** : Ajout du suivi par exercice (charge max & 1RM estimé Epley), calendrier d'assiduité sur 28 jours et compteur de semaines consécutives (*Streak* 🔥).
  - **Programmes** : Boutons pour dupliquer un programme, l'exporter seul en `.json` ou importer un programme partagé.
- **v3.0.2** : Ajout du nom du jour en 3 lettres (ex: LUN, MAR) sous la date dans les statistiques.
- **v3.0.1** : Hotfix d'un bug CSS (Flexbox) empêchant les barres du graphique de s'afficher correctement sur certains navigateurs mobiles. Augmentation de la version du Service Worker pour forcer la mise à jour du cache.

- **v3.0 : Statistiques & Sauvegarde** : Ajout d'un tout nouvel onglet Statistiques (impact global, volume total soulevé, graphique des 10 dernières séances). Système complet d'Export/Import (JSON) pour sécuriser ou transférer vos données d'un appareil à l'autre. Confort de l'éditeur de programme renforcé avec l'ajout de boutons tactiles natifs (Monter / Descendre) pour un réagencement robuste. Architecture JS entièrement documentée et typée (JSDoc).
- **v2.2 : Architecture Modulaire & Son Bluetooth** : Refonte interne majeure (fichiers JS découpés pour plus de maintenabilité), correction sécuritaire (faille XSS mitigée via `escapeHTML`), conception d'un nouveau design sonore "Double Bip" percutant et remplacement de l'API Web Audio par un générateur WAV interne pour assurer la compatibilité du son sur les écouteurs Bluetooth sous iOS Safari.
- **v2.1 : Améliorations de séance & Fiche Sportive** : Ajout de la possibilité de supprimer n'importe quelle série à la volée pendant l'entraînement. Intégration d'une nouvelle page HTML autonome (`programme_sport.html`) pour présenter les exercices de façon isolée et esthétique.
- **v2.0 : Personnalisation Dynamique** : Refonte majeure avec la création d'un **Éditeur de Programmes** visuel. Vous pouvez maintenant créer, modifier et supprimer vos propres jours et exercices. Les programmes sont mutualisés sur l'appareil, mais la sélection du "programme actif" reste spécifique au profil ! Options de suppression d'utilisateurs ajoutée à l'écran d'accueil.
- **v1.7** : Changement de stratégie de cache Service Worker en *Stale-While-Revalidate* pour corriger un blocage F5 sur d'anciennes versions.
- **v1.6** : Correction du crash écran blanc au rechargement (F5) lié à la *Temporal Dead Zone* du navigateur (`ReferenceError` sur `APP_VERSION`).
- **v1.5** : Désactivation du `pull-to-refresh` Android natif (`overscroll-behavior: none`) pour empêcher la recharge accidentelle et la perte d'état en glissant vers le bas.
- **v1.4** : Audit de code. Correction d'un bug où les listeners de navigation pouvaient se dupliquer suite à de multiples appels d'initialisation.
- **v1.3** : Ajout de la mécanique de mise à jour transparente du Service Worker (`skipWaiting` et `clients.claim`). Plus besoin de fermer l'app manuellement pour appliquer une nouvelle version !
- **v1.2** : Affichage dynamique de la version (`vX.Y`) en bas de l'écran Programme et refonte de la gestion du cache SW.
- **v1.1** : Ajout des guides d'installation officiels (MANUEL_IOS, MANUEL_ANDROID) et premières métadonnées PWA (`manifest.json`, icones).
- **v1.0** : Lancement initial. Programme 5 jours, timers, isolations localStorage multi-profils et stockage hors-ligne basique.


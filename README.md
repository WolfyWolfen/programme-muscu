# 💪 Mon Programme — PWA Musculation

> **Version 3.0.2** · [Ouvrir l'application](https://wolfywolfen.github.io/programme-muscu/)

Application web progressive (PWA) de suivi d'entraînement musculaire. Accessible sur Android et iOS, installable comme une app native, **sans compte ni connexion**, fonctionne 100% hors-ligne.

---

## ✨ Fonctionnalités

- **Éditeur de Programmes** — Créez, modifiez et partagez une infinité de programmes sportifs complets
- **Multi-profils & Isolation** — Données strictement liées au profil choisi, sans mélange
- **Suivi des séries** — Poids & reps pré-remplis depuis votre dernière séance
- **Chrono de repos** — Temps automatique et personnalisable par exercice
- **Chrono de séance** — Démarrage manuel, durée enregistrée dans l'historique
- **Historique complet** — Suppression par séance, exercice ou série isolée
- **Durée estimée** — Affichée sur chaque journée dans l'accueil
- **100% offline** — Service Worker + cache, aucune connexion requise après le 1er chargement
- **Mise à jour automatique** — Les nouveaux ajouts arrivent sans action de l'utilisateur

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

## 🗓 Programmes (100% Personnalisables)

L'application repose sur un système dynamique : **vous n'êtes plus limité à un programme pré-défini**. 
Vous pouvez accéder au gestionnaire (icône ⚙️) pour créer une infinité de programmes selon vos objectifs (PPL, Split, Full Body, Force, etc).
  
Lors de la toute première utilisation, l'application génèrera un programme par défaut, le classique **Split 4 Jours (Standard)** :
- **Lundi** : Pecs & Triceps
- **Mardi** : Dos & Biceps
- **Mercredi** : Cardio (Optionnel)
- **Jeudi** : Jambes (Quadri & Ischios)
- **Vendredi** : Full Haut du Corps

Ce programme n'est qu'un point de départ. Vous êtes libre de le supprimer, de l'éditer ou de créer le vôtre de A à Z (Nom du jour, Poids, Exercices, Séries et Repos) !

---

## 🛠 Stack technique

`HTML` · `CSS` · `JavaScript vanilla` · `localStorage` · `Service Worker` · `PWA Manifest`

---

## 🔒 Confidentialité

Toutes les données sont stockées **localement sur votre appareil** (localStorage). Aucune donnée n'est envoyée à un serveur. Chaque profil utilisateur a son propre espace de stockage isolé.

---

## 🔄 Mettre à jour l'application (pour les développeurs)

1. Modifier le code source (`app.js`, `style.css`, `index.html`...)
2. Ouvrir `sw.js` et incrémenter `CACHE_NAME` (ex: `v2.1` → `v2.2`)
3. Faire de même pour `APP_VERSION` dans `app.js`
4. `git add . && git commit -m "Version X.Y" && git push`

Les utilisateurs recevront la mise à jour automatiquement au prochain lancement de l'application.

---

## 📜 Historique des versions (Changelog)

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


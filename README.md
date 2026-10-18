# 💪 Mon Programme — PWA Musculation

> **Version 3.2.1** · [Ouvrir l'application](https://wolfywolfen.github.io/programme-muscu/)

Application web progressive (PWA) de suivi d'entraînement musculaire. Accessible sur Android et iOS, installable comme une app native, **sans compte ni connexion**, fonctionne 100% hors-ligne.

---

## ✨ Fonctionnalités

- **Éditeur & Partage de Programmes** — Créez, dupliquez et exportez/importez individuellement vos programmes sportifs
- **Surcharge Progressive & Records (PR)** — Rappel de la séance précédente sous chaque série, calcul du 1RM estimé (Epley), détection automatique des PR 🏆 et notes persistantes par exercice
- **Statistiques Avancées** — Courbe de progression par exercice (Charge & 1RM), calendrier d'assiduité (28 jours), série de semaines (*Streak* 🔥) et volume global
- **Confort Mobile & Anti-veille** — Maintien de l'écran allumé (*Wake Lock*), chronos basés sur l'horloge système (résistants à la mise en veille), calculateur de disques 🧮 et barre de progression de séance
- **Multi-profils & Isolation** — Données strictement liées au profil choisi, sans mélange
- **Historique complet** — Suppression par séance, exercice ou série isolée
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

- **v3.2.1** : Hotfix mobile pour la largeur de la case `REPS` (déplacement du bouton `+1 rep` sous la série et suppression des flèches natives des champs numériques pour éviter que le nombre soit tronqué sous le texte `REPS`).
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


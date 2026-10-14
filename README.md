# Muscu — mon programme

Appli web (PWA) de suivi de musculation : programme Fitness Park sur 12 semaines, vidéo de chaque exercice, suggestion de charge, minuteur de repos, pesée du vendredi et progression.
Les données restent sur le téléphone (localStorage). Une sauvegarde JSON s'exporte depuis l'onglet « Mon cycle ».

## Commandes

```bash
npm install
npm run dev        # serveur local
npm test           # tests de la logique
npm run coverage   # couverture
npm run build      # build de production (PWA)
npm run icons      # régénère les icônes PNG
```

Ajouter `?date=2026-10-16` à l'URL simule un autre jour.

## Publication

`npm run publier` lance les tests, construit l'appli pour GitHub Pages (`/muscu/`) et pousse le dossier `dist` sur la branche `gh-pages`.
Adresse : https://hugomnr6-ship-it.github.io/muscu/

## Crédits

Démos courtes : Renaissance Periodization, PureGym, BrooklynFitness, Fitbody by Egle Nabi. Tutos complets en français : Bodykev Coaching, BmD, etc. Toutes les vidéos sont lues via le lecteur intégré youtube-nocookie.

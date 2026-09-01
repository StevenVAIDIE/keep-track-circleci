# Keep Track CircleCI

Extension de navigateur (Firefox) qui affiche en direct le statut des builds CircleCI de vos branches, directement sur GitHub et sur CircleCI.

![Capture d'écran de l'extension](docs/screenshot-placeholder.png)
<!-- TODO: remplacer par une vraie capture d'écran du popup et/ou de l'overlay injecté sur GitHub/CircleCI -->

## Fonctionnalités

- Suivi automatique du statut des workflows CircleCI (succès, échec, en cours, en attente, arrêté, relancé) pour une liste de branches/PR suivies.
- Injection d'un script de contenu sur `github.com` et `app.circleci.com` pour afficher le statut directement dans la page.
- Popup d'extension listant les branches suivies, groupées, avec possibilité de les retirer.
- Approbation des étapes manuelles ("hold") d'un workflow directement depuis l'extension.
- Notifications navigateur sur changement de statut.
- Mute/unmute par branche pour couper les notifications ponctuellement.
- Page de réglages pour configurer le token API CircleCI (stocké en local, `storage` de l'extension).

## Stack technique

- React 18 + TypeScript
- `styled-components` pour le style
- `webextension-polyfill` pour l'API navigateur cross-browser
- Bundling via `esbuild` (`build.js`), packaging/signing via `web-ext`
- Manifest V2 (cible Firefox, voir `browser_specific_settings.gecko`)

## Structure du projet

```
src/
  background.ts       # service worker : polling CircleCI, notifications, alarms
  content.tsx          # script injecté sur github.com / app.circleci.com
  popup.tsx            # point d'entrée du popup
  settings.tsx          # point d'entrée de la page de réglages
  pages/                # composants racine Popup / Content / Settings
  components/           # composants UI partagés
  hooks/                # logique métier (appels API CircleCI, storage, etc.)
  model/                # types et helpers sur PullRequest / Workflow / Status
  icons/                # icônes SVG en composants React
manifest.json           # manifest de l'extension (Manifest V2)
build.js                 # script de build esbuild
scripts/publish.sh       # lint + build + publication sur addons.mozilla.org
```

## Prérequis

- Node.js et Yarn
- Un token d'API CircleCI ([circleci.com/account/api](https://app.circleci.com/settings/user/tokens)) pour utiliser l'extension une fois installée

## Installation et développement

```bash
yarn install
yarn lib:build
```

Cela génère le bundle de l'extension dans `dist/`. Pour rebuilder automatiquement à chaque changement :

```bash
yarn lib:build:watch
```

### Charger l'extension en local (Firefox)

1. `yarn lib:build`
2. Ouvrir `about:debugging#/runtime/this-firefox`
3. "Charger un module complémentaire temporaire" → sélectionner `dist/manifest.json`

Ou directement lancer un Firefox avec l'extension chargée :

```bash
yarn extension:run
```

### Configurer le token CircleCI

Une fois l'extension chargée, ouvrir sa page de réglages (`settings.html`) et renseigner le token API CircleCI.

## Scripts disponibles

| Script | Description |
| --- | --- |
| `yarn lib:build` | Build de l'extension avec esbuild dans `dist/` |
| `yarn lib:build:watch` | Build en mode watch |
| `yarn extension:build` | Build puis packaging (`web-ext build`) dans `dist/` |
| `yarn extension:lint` | Build puis lint du package via `web-ext lint` |
| `yarn extension:run` | Lance Firefox avec l'extension chargée (console incluse) |
| `yarn extension:publish` | Signe le package via `web-ext sign` |
| `yarn extension:release` | Lint + build + publish (`scripts/publish.sh`) |

## Publication automatique (CI)

Le workflow `.github/workflows/publish.yml` publie automatiquement l'extension sur addons.mozilla.org à chaque push d'un tag `v*.*.*` (ou manuellement via "Run workflow" dans l'onglet Actions). Le job tourne sous l'environment GitHub `production` (protection rules configurables : reviewers requis, restriction de branches/tags). Il exécute `yarn extension:release` avec les secrets `WEB_EXT_API_KEY` et `WEB_EXT_API_SECRET` (récupérables sur [addons.mozilla.org/developers/addon/api/key](https://addons.mozilla.org/developers/addon/api/key/)) à configurer dans Settings → Environments → `production` → Environment secrets.

Penser à faire correspondre le tag et la `version` de `manifest.json` avant de tagger.

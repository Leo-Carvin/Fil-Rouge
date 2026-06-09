# Structure du projet

## Racine

- `backend/` API Express de PCStore.
- `frontend/pc-configurator/` application React/Vite.
- `database/` scripts SQL et initialisation de base.
- `docker-compose.yml` environnement de developpement Docker.

## Backend

Le backend suit une organisation proche MVC :

- `src/app.js` configure Express.
- `src/server.js` lance le serveur.
- `src/routes/` declare les routes HTTP.
- `src/controllers/` traite les requetes HTTP.
- `src/models/` contient les requetes base de donnees.
- `src/middleware/` contient les middlewares.
- `src/services/` contient les services externes.
- `src/config/` contient la configuration technique.
- `scripts/` contient les scripts utilitaires hors API.

## Frontend

Le frontend est deja separe par responsabilites :

- `src/pages/` pages principales.
- `src/components/` composants reutilisables.
- `src/components/admin/` composants specialises admin.
- `src/context/` contextes React.
- `src/api/` appels API.
- `src/assets/` images et assets locaux.
- `data/` donnees et outils lies au dataset PC.

## Database

- `database/Scripts/` scripts SQL de creation ou d'alimentation.

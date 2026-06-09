# Backend PCStore

Le backend est organise autour d'une structure proche MVC.

## Structure

- `src/server.js` demarre le serveur HTTP.
- `src/app.js` configure Express, les middlewares globaux et les routes.
- `src/routes/` declare les endpoints et applique les middlewares de route.
- `src/controllers/` gere les objets `req` / `res` et orchestre les actions.
- `src/models/` contient les requetes et acces a la base de donnees.
- `src/middleware/` contient les middlewares Express reutilisables.
- `src/services/` contient les integrations externes, comme l'envoi d'emails.
- `src/config/` contient la configuration technique, comme la connexion DB.
- `scripts/` contient les scripts utilitaires ponctuels.

## Commandes

```bash
npm run dev
npm start
npm test
```

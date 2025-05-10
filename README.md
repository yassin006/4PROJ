Trafine Backend
Backend complet pour le projet **Trafine**, une application collaborative de navigation et de
signalement dincidents routiers en temps rel. Ce backend est dvelopp avec NestJS, utilise
MongoDB, et expose une API REST scurise, extensible et conteneurise via Docker.
------------------------------------------------------------
 Fonctionnalits Implmentes
- Authentification JWT (register, login, logout, refresh, me)
- Authentification OAuth2 avec Google (`/auth/google`)
- Gestion des rles (`admin`, `user`, etc.)
- Cration et suppression dincidents
- Recherche gographique nearby (`/incidents/nearby?lat=...&lng=...`)
- Systme de validation communautaire (vote incident : valider / invalider)
- Recalcul ditinraire en vitant les incidents (via OpenRouteService)
- Statistiques admin (`/stats/incidents`)
- Prdictions dembouteillages (`/predictions/congestion`)
- Notifications en temps rel (WebSocket via Socket.IO)
- Envoi de mails pour rinitialisation de mot de passe
- Documentation Swagger (http://localhost:3000/api)
- Dockerisation complte avec environnement local + docker
------------------------------------------------------------
 Structure technique
backend/
src/
auth/ # JWT, Google OAuth2, reset password
users/ # CRUD utilisateur, rles
incidents/ # Signalements, votes, validation
stats/ # Donnes agrges pour admin
predictions/ # Dtection des zones de congestion
routes/ # Calculs ditinraire et recalculs
notifications/ # Envoi + rception temps rel
common/ # Filtres globaux, pipes, middlewares
main.ts # Bootstrap, WebSocket, Swagger
app.module.ts # Modules imports
.env / .env.docker # Configuration locale / dockerise
Dockerfile # Image backend NestJS
README.md # Ce fichier
------------------------------------------------------------
 Lancer en local
# Installer les dpendances
npm install
# Lancer lenvironnement de dveloppement
npm run start:dev
API disponible sur : http://localhost:3000
------------------------------------------------------------
 Lancer avec Docker
# Build de limage Docker
docker build -t trafine-backend .
# Lancer le conteneur avec les bonnes variables
docker run -p 3000:3000 --env-file .env.docker trafine-backend
Ou bien avec docker-compose (recommand) depuis la racine du projet :
docker-compose up --build
------------------------------------------------------------
 Variables denvironnement (extrait)
# .env.local ou .env.docker
JWT_SECRET=trafineSuperSecretKey2025
MONGODB_URI_LOCAL=mongodb://localhost:27017/trafine_db
MONGODB_URI_DOCKER=mongodb://mongo:27017/trafine_db
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
EMAIL_USER=...
EMAIL_PASS=...
------------------------------------------------------------
 Documentation API
La documentation Swagger est disponible :
http://localhost:3000/api
Elle rpertorie tous les endpoints disponibles ainsi que leurs schmas et protections (JWT).
------------------------------------------------------------
 Tests
- Tests unitaires & e2e (NestJS Testing)
- Tests manuels via Postman (auth, incidents, stats, prdictions)
- Scurit teste avec rles, tokens expirs ou manquants

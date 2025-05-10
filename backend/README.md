🚀 ClearWay – Backend API (NestJS)

Ce répertoire contient l'API backend du projet ClearWay, une application de navigation en temps réel et participative. Cette API est construite avec le framework NestJS et connectée à une base de données MongoDB. Elle gère l’authentification (JWT et OAuth2), les incidents, les utilisateurs, les statistiques, les prédictions de trafic, les notifications et les itinéraires.

🧩 Fonctionnalités principales

🔐 Authentification (JWT, OAuth2 Google)

🧑‍🤝‍🧑 Gestion des utilisateurs (CRUD + rôles)

🚧 Signalement et modération d’incidents

📊 Statistiques en temps réel sur les incidents

📍 Prédiction des zones de congestion

📬 Notifications push WebSocket (Socket.IO)

🗺️ Recalcul d’itinéraire avec OpenRouteService

🧪 Tests E2E avec Jest et Postman

📄 Documentation Swagger (http://localhost:3000/api)

⚙️ Technologies utilisées

Framework : NestJS (Node.js, TypeScript)

Base de données : MongoDB (via Mongoose)

WebSocket : Socket.IO

API externe : OpenRouteService (HEiGIT)

Email : SMTP (Gmail)

Sécurité : JWT, Google OAuth2, validation class-validator

Conteneurisation : Docker, Docker Compose

📁 Structure simplifiée

backend/
├── src/
│   ├── auth/               # Authentification + Google OAuth2
│   ├── users/              # Utilisateurs & rôles
│   ├── incidents/          # Signalements + validation communautaire
│   ├── stats/              # Statistiques incidents
│   ├── predictions/        # Prédictions de trafic
│   ├── routes/             # Itinéraires et recalcul
│   ├── notifications/      # Notifications WebSocket
│   ├── common/             # Filtres, middlewares
│   ├── main.ts             # Point d’entrée + config Swagger & WebSocket
│   └── app.module.ts       # Modules importés
├── .env / .env.docker      # Variables d’environnement locales & docker
├── Dockerfile              # Image backend
└── README.md               # Ce fichier

⚙️ Installation locale

npm install
npm run start:dev

API disponible sur : http://localhost:3000

🐳 Lancement avec Docker

docker build -t clearway-api .
docker run -p 3000:3000 --env-file .env.docker clearway-api

Ou via docker-compose à la racine du projet :

docker-compose up --build

🔐 Sécurité et configuration

Les variables d’environnement principales sont définies dans .env et .env.docker :

JWT_SECRET=trafineSuperSecretKey2025
MONGODB_URI_LOCAL=mongodb://localhost:27017/trafine_db
MONGODB_URI_DOCKER=mongodb://mongo:27017/trafine_db
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
EMAIL_USER=...
EMAIL_PASS=...

Le fichier main.ts configure les pipes de validation, les filtres d’erreurs, CORS, Swagger, et initialise Socket.IO.

🔍 Swagger

Une documentation Swagger est disponible à :
👉 http://localhost:3000/api

🧪 Tests

npm run test : tests unitaires

npm run test:e2e : tests end-to-end

Requêtes validées via Postman (auth, incidents, prédictions...)

👤 Auteurs (backend)

Yousfi Mohamed Yassine (développement principal, architecture, sécurité)
🚦 ClearWay — Application de Navigation Collaborative

ClearWay est une solution complète (web + mobile) de navigation participative en temps réel, permettant aux utilisateurs de signaler, visualiser et éviter les incidents routiers (accidents, bouchons, travaux…). Elle s’appuie sur des technologies modernes (NestJS, React, React Native, MongoDB, Expo, etc.) et propose des fonctionnalités avancées comme l’authentification JWT & Google OAuth2, la cartographie interactive, les notifications, et les prévisions de trafic.

🔗 Dépôt Git

https://github.com/yassin006/4PROJ

📦 Déploiement complet avec Docker

Cloner le projet

git clone https://github.com/yassin006/4PROJ.git
cd 4PROJ

**Créer un fichier .env.docker dans le dossier **backend/ avec ce contenu :

MONGODB_URI_DOCKER=mongodb://mongo:27017/trafine_db
JWT_SECRET=your_super_secret_key
ORS_API_KEY=your_openrouteservice_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/redirect

Lancer tous les services

docker-compose up --build

🧐 Backend NestJS : http://localhost:3000

🌐 Frontend Web : http://localhost:5173

🐬 MongoDB (Docker) : trafine_mongo container

⚖️ Admin user à insérer manuellement dans MongoDB (voir plus bas)

🖥️ Interface Web (React)

Lancement en local

cd frontend-web
npm install
npm run dev

Accès : http://localhost:5173

Lancement avec Docker

cd frontend-web
docker build -t clearway-web .
docker run -p 5173:80 clearway-web

📱 Application Mobile (React Native + Expo)

Installation

cd frontend-mobile
npm install

Lancement

npx expo start

Scanne le QR avec Expo Go ou lance l’émulateur Android via Android Studio

🔐 Création d’un compte admin (via MongoDB Docker)

docker exec -it trafine_mongo mongosh
use trafine_db
db.users.insertOne({
  email: "admin@example.com",
  password: "<mot_de_passe_hashé>", // utiliser bcrypt.hashSync("ton_mot_de_passe", 10)
  role: "admin",
  profileImage: null
})

⚙️ Technologies

Backend : NestJS + MongoDB + WebSocket

Web : React + TypeScript + Leaflet + TailwindCSS

Mobile : React Native + Expo + Axios

Auth : JWT + Google OAuth2

Notifications : Socket.IO + MongoDB

Prévision trafic : Agrégation MongoDB + ORS API

✅ Tests

Tests unitaires & E2E (NestJS + Jest + Supertest)

cd backend
npm run test
npm run test:e2e

👤 Auteurs

Yousfi Mohamed Yassine – Développement Backend & Web

Guillaume Robota – Développement Mobile (Expo / React Native)
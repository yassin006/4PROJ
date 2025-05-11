# 📘 ClearWay — Interface Web (Frontend)

Cette interface web fait partie du projet **ClearWay**, une application de navigation participative en temps réel. Elle est développée avec **React**, **TypeScript**, **Leaflet** et **Tailwind CSS**, et se connecte à une API NestJS via **JWT**.

---

## 🔧 Fonctionnalités (Frontend)

- Affichage de la carte en temps réel (**Leaflet + OpenStreetMap**)
- Géolocalisation et tracé d’itinéraire dynamique
- Signalement d’incidents avec image, type, gravité et validation communautaire
- Visualisation des zones de congestion (prévisions depuis backend)
- Notification toast en temps réel via **WebSocket (Socket.IO)**
- Authentification par **JWT** et **Google OAuth2**
- Profil utilisateur : mise à jour email, mot de passe, image, suppression
- Dashboard admin (accès réservé) : gestion utilisateurs + incidents
- Intégration complète avec backend **REST sécurisé**

---

## 🚀 Technologies utilisées

- React + TypeScript
- Leaflet.js (cartographie)
- TailwindCSS (design responsive)
- React Router DOM (navigation)
- Socket.IO Client (temps réel)
- React Hot Toast (notifications)

---

## ⚙️ Installation locale (développement)

### 1. Cloner le projet
```bash
git clone https://github.com/ton-repo/clearway-web.git
cd clearway-web
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Lancer le projet en mode développement
```bash
npm run dev
```

Par défaut, l’interface sera disponible sur :
```
http://localhost:5173
```

⚠️ Assurez-vous que l'API backend est bien accessible sur `http://localhost:3000`

---

## 🐳 Lancement via Docker (frontend uniquement)

### 1. Construire l’image
```bash
docker build -t clearway-web .
```

### 2. Lancer le conteneur
```bash
docker run -p 5173:80 clearway-web
```

## 📁 Structure principale

```
trafine-web/
├── src/
│   ├── pages/         # Pages (MapView, Login, Register, etc.)
│   ├── components/    # Formulaires et composants (IncidentForm, RouteForm...)
│   ├── api/           # Appels API (axios, services incidents, utilisateurs...)
│   ├── contexts/      # AuthContext
├── public/
├── Dockerfile
├── vite.config.ts
└── README.md
```

---

## 👤 Accès à l’application

- Page d’accueil avec carte interactive et incidents
- Boutons flottants : signaler un incident, lancer la navigation, recalculer l’itinéraire, arrêter la navigation
- Page de connexion / inscription (avec OAuth2 Google)
- Page de profil avec : édition des informations + notifications reçues
- Page 404 (NotFound)
- Accès conditionnel au tableau de bord **admin**

---

## 🔐 Sécurité côté client

- Stockage du token JWT dans `localStorage`
- Décodage des rôles pour affichage conditionnel (ex. : bouton **Dashboard**)
- Gestion automatique des redirections non authentifiées

---

## 👨‍💻 Développeurs (Frontend)

- **Yousfi Mohamed Yassine** — Développement principal des interfaces Web ClearWay
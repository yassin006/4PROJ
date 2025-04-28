# 🚀 Trafine Backend

Backend complet pour le projet **Trafine**, une application collaborative de navigation et de signalement d’incidents routiers en temps réel.

---

## ✅ Fonctionnalités Implémentées

- 🔐 Authentification JWT (register, login, logout, refresh, me)
- 🪪 Authentification OAuth2 avec Google (`/auth/google`)
- 👥 Gestion des rôles (`admin`, `user`, etc.)
- 📍 Création d’incidents (POST `/incidents`)
- 🧭 Recherche géographique "nearby" (GET `/incidents/nearby?lat=...&lng=...`)
- 📊 Statistiques admin (GET `/stats/incidents`)
- 🔮 Prédictions embouteillage (GET `/predictions/congestion`)
- 🐳 Dockerisation complète (`docker-compose.yml`)
- 🔐 .env local et docker fonctionnels

---

## ⚙️ Lancer en local

```bash
# Installation des dépendances
npm install

# Lancer en mode dev
npm run start:dev

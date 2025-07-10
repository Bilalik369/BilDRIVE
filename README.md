# 🚗 Bildrive

**Bildrive** est une **plateforme web innovante** de mobilité intégrée, conçue pour répondre à deux besoins essentiels :  
le **transport de personnes** (type covoiturage) et la **livraison de colis**, dans une seule et même application simple, fluide et sécurisée.

> Un modèle hybride inédit qui mutualise les trajets pour réduire les coûts, tout en optimisant la rentabilité des chauffeurs.

---

## 📌 Sommaire

- [🎯 Objectif](#-objectif)
- [📝 Présentation](#-présentation)
- [🛠 Fonctionnalités](#-fonctionnalités)
- [⚙️ Stack Technique](#️-stack-technique)
- [🏗 Architecture](#-architecture)
- [🔐 Sécurité](#-sécurité)
- [🚀 Installation & Lancement](#-installation--lancement)
- [🧪 Fichier .env](#-fichier-env)
- [📦 Docker](#-docker)
- [🤝 Contribution](#-contribution)
- [📄 Licence](#-licence)

---

## 🎯 Objectif

- 💡 Répondre aux besoins des utilisateurs souhaitant se déplacer ou envoyer un colis.  
- 🚙 Permettre aux chauffeurs d’optimiser leur itinéraire et d’augmenter leur rentabilité en combinant plusieurs missions.  
- 🌍 Réduire l’impact écologique par la mutualisation des trajets.

---

## 📝 Présentation

Bildrive offre une **interface moderne** et **responsive** pour :

- Commander un trajet ou faire livrer un colis  
- Suivre son chauffeur en temps réel  
- Payer en ligne via une passerelle sécurisée  
- Laisser des avis et consulter l’historique de ses courses  
- Pour les chauffeurs : recevoir, gérer et effectuer des missions

---

## 🛠 Fonctionnalités

### 👤 Côté Utilisateur

- Authentification (email + réseaux sociaux)
- Réservation simple (trajet ou livraison)
- Géolocalisation temps réel du chauffeur
- Historique complet des courses
- Paiement en ligne sécurisé (Stripe ou PayPal)
- Système de notation & commentaires
- Notifications push (Firebase Cloud Messaging)

### 🚖 Côté Chauffeur

- Création de compte avec upload des justificatifs
- Choix des types de missions (passagers, colis ou les deux)
- Suivi GPS en temps réel
- Gestion des missions en parallèle
- Revenus quotidiens & statistiques
- Chat avec les clients

### 🛡️ Côté Admin

- Dashboard global de supervision
- Gestion des utilisateurs et chauffeurs
- Modération des avis et commentaires
- Statistiques avancées (revenus, trafic, utilisateurs actifs)
- Gestion des réclamations et litiges

---

## ⚙️ Stack Technique

| Côté       | Techno utilisées                     |
|------------|---------------------------------------|
| Frontend   | React JS, Tailwind CSS, Axios        |
| Backend    | Node.js, Express.js                  |
| Base de données | MongoDB (Mongoose)             |
| Authentification | JWT, OAuth 2.0 (Google, Facebook) |
| API externes | Google Maps API (Directions + Geocoding) |
| Paiement   | Stripe / PayPal                      |
| Notifications | Firebase Cloud Messaging (FCM)    |
| CI/CD      | GitHub Actions, ESLint, Prettier     |
| Hébergement | Render / Vercel, MongoDB Atlas      |

---

## 🏗 Architecture

- **Architecture MVC** sur le backend (Model / View / Controller)
- Séparation des responsabilités claire
- Utilisation de **UML** :  
  - Diagrammes de classes  
  - Diagrammes de séquence  
  - Cas d'utilisation

- **Gestion des rôles et permissions** :
  - `Utilisateur`
  - `Chauffeur`
  - `Administrateur`

- **Gestion des statuts de mission** :
  - En attente → Acceptée → En cours → Terminée → Notée

---

## 🔐 Sécurité

- Middleware de vérification des rôles (RBAC)
- Hashage des mots de passe avec `bcrypt`
- Protection API : `helmet`, `rate-limiting`, `cors`, etc.
- Vérification d’email
- Sécurisation des endpoints avec JWT

---

## 🚀 Installation & Lancement

### 💻 En mode développement (sans Docker)

```bash
git clone https://github.com/username/bildrive.git
cd bildrive

# Installer les dépendances
npm install

# Ajouter le fichier .env
cp .env.example .env

# Modifier les variables dans .env puis démarrer
npm run dev

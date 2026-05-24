# 🎬 Cinephoria Office - Application de Gestion des Incidents
Application bureautique développée avec Electron pour la gestion des incidents techniques dans le cinéma Cinephoria. Permet aux employés de signaler et suivre les problèmes techniques en temps réel.

## 🚀 Fonctionnalités

### Frontend (Electron)
🚨 Gestion des Incidents

Signalement d'incidents avec description détaillée
Assignation de priorité (Basse, Moyenne, Haute, Critique)
Filtrage avancé par salle, statut et priorité
Statistiques en temps réel avec dashboard
Historique complet des incidents

💼 Interface Professionnelle

Design moderne style Netflix
Interface desktop native avec Electron
Expérience utilisateur optimisée
Thème sombre élégant
Navigation intuitive

📊 Export et Rapports

Export PDF avec mise en page professionnelle
Export JSON pour l'analyse de données
Export CSV compatible Excel
Rapports automatisés

🛠 Technologies Utilisées

Frontend

Electron - Applications desktop cross-platform
HTML5/CSS3 - Interface utilisateur
JavaScript Vanilla - Logique métier

Backend

Node.js - Runtime JavaScript
Express.js - Framework web
PostgreSQL - Base de données relationnelle
Sequelize - ORM pour PostgreSQL

📦 Installation

Prérequis

Node.js 16+
PostgreSQL 12+
npm ou yarn

1. Cloner le Repository
git clone https://github.com/votre-username/cinephoria-office.git
cd cinephoria-office

2. Configuration Backend
bash
cd backend

# Installer les dépendances
npm install

# Configuration environnement
cp .env.example .env
# Éditer .env avec vos paramètres de base de données

# Lancer les migrations
npx sequelize-cli db:migrate

# Peupler la base de données (optionnel)
npx sequelize-cli db:seed:all

# Démarrer le serveur de développement
npm run dev
3. Configuration Frontend
bash
cd ../electron-app

# Installer les dépendances
npm install

# Démarrer l'application en mode développement
npm start

# Build pour la production
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux
🗄 Structure du Projet
text
cinephoria-office/
├── 📁 backend/                 # API Server
│   ├── 📁 controllers/        # Logique métier
│   ├── 📁 models/            # Modèles de données
│   ├── 📁 routes/            # Routes API
│   ├── 📁 migrations/        # Migrations base de données
│   └── 📁 seeders/           # Données de test
├── 📁 electron-app/           # Application Electron
│   ├── 📁 src/
│   │   ├── 📁 main/          # Processus principal
│   │   ├── 📁 renderer/      # Interface utilisateur
│   │   └── 📁 shared/        # Code partagé
│   └── package.json
└── 📁 docs/                   # Documentation
🚀 Utilisation
Démarrage en Développement
bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd electron-app && npm start
Build Production
bash
# Build pour Windows
npm run build:win

# Build pour macOS
npm run build:mac

# Build pour Linux
npm run build:linux

📡 API Endpoints
Incidents
GET /api/office/incidents - Liste tous les incidents

POST /api/office/incidents - Créer un nouvel incident

PUT /api/office/incidents/:id - Mettre à jour un incident

GET /api/office/incidents/stats - Statistiques des incidents

Salles & Équipements
GET /api/office/rooms - Liste des salles

GET /api/office/rooms/:id/equipment - Équipements par salle

🎯 Captures d'écran
Interface Principale
https://docs/screenshots/dashboard.png

Création d'Incident
https://docs/screenshots/new-incident.png

Liste des Incidents
https://docs/screenshots/incidents-list.png

🧪 Tests
bash
# Tests Backend
cd backend
npm test

# Tests Frontend
cd electron-app
npm test

# Tests E2E
npm run test:e2e

🔧 Configuration
Variables d'Environnement Backend
env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cinephoria_office
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe

NODE_ENV=development
API_PORT=3000
Configuration Electron
json
{
  "appId": "com.cinephoria.office",
  "productName": "Cinephoria Office",
  "directories": {
    "output": "dist"
  }
}



Convention de Commit
feat: Nouvelle fonctionnalité

fix: Correction de bug

docs: Documentation

style: Formatage

refactor: Refactoring

test: Tests

🐛 Dépannage
Problèmes Courants
L'application ne se lance pas

bash
# Supprimer node_modules et réinstaller
rm -rf node_modules
npm install
Erreur de connexion à la base de données

Vérifier les variables d'environnement dans .env

S'assurer que PostgreSQL est démarré

Vérifier les permissions de la base de données

Problèmes de build Electron

bash
# Nettoyer le cache
npm run clean
npm install
📄 Licence
Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

👥 Auteurs
RIAD Reda fethi - Développement initial - *Développeur Full-Stack* -[GitHub](https://github.com/redondo-dev).
- **Email** : riad.reda.fethi@gmail.com
- **LinkedIn** : [Mon Profil](https://www.linkedin.com/in/riad-reda-fethi/)


📞 Support
📧 Email : support@cinephoria.com

🐛 Signaler un bug

💡 Suggérer une fonctionnalité

Cinephoria Office - Simplifiez la gestion des incidents techniques 🎬✨

Dernière mise à jour : 19 Novembre 2025



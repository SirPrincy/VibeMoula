# 💎 VibeMoula

**VibeMoula** est une application de gestion financière personnelle ultra-minimaliste, esthétique et performante. Conçue avec une approche "Soft Editorial", elle offre une expérience utilisateur premium inspirée du design d'Apple.

## 🚀 Fonctionnalités
- **Dashboard Consolidé** : Vue unifiée de tous vos avoirs avec conversion automatique dans votre devise de dashboard.
- **Budgets Mensuels** : Définissez des limites par catégorie et suivez votre progression en temps réel.
- **Transactions Récurrentes** : Automatisez votre routine financière (loyer, abonnements, salaire).
- **Catégories Paramétrables** : Créez votre propre système d'organisation avec icônes personnalisées.
- **Multi-Wallets** : Portefeuilles illimités avec devises indépendantes (FCFA, USD, EUR, etc.).
- **Rapprochement** : Marquez vos transactions comme "vérifiées" pour une comptabilité sans faille.
- **Local-First & Résilience** : Stockage SQLite local avec système d'import/export structuré et versionné.

## 🛠️ Stack Technique
- **Frontend** : React 18 + Vite + TypeScript + **TanStack Query**.
- **Backend** : Node.js + Express + TypeScript.
- **ORM** : **Drizzle ORM** pour un accès type-safe à la base de données.
- **Base de données** : SQLite (`better-sqlite3`).
- **Validation** : Zod (Schémas unifiés frontend/backend).

## 📦 Installation
```bash
# Installer les dépendances
npm install
# Ou si vous préférez pnpm ou yarn :
# pnpm install
# yarn install

# Lancer l'application (Frontend + Backend)
npm run dev
```

## 🏗️ Build
```bash
# Générer le bundle de production
npm run build
```

## 📜 Licence
Ce projet est sous licence **MIT**.

# 💎 VibeMoula V4.0

**VibeMoula** est une application de gestion financière personnelle ultra-minimaliste, esthétique et performante. Conçue avec une approche "Soft Editorial", elle offre une expérience utilisateur premium inspirée du design d'Apple.

## 🚀 Fonctionnalités
- **Dashboard Consolidé** : Vue unifiée de tous vos avoirs avec conversion automatique dans votre devise de dashboard.
- **Budgets Mensuels** : Définissez des limites par catégorie et suivez votre progression en temps réel.
- **Transactions Récurrentes** : Automatisez votre routine financière (loyer, abonnements, salaire).
- **Catégories Paramétrables** : Créez votre propre système d'organisation avec icônes personnalisées.
- **Multi-Wallets** : Portefeuilles illimités avec devises indépendantes (FCFA, USD, EUR, etc.).
- **Épargne & Dettes** : Suivi précis des objectifs d'épargne et des remboursements de dettes.
- **Rapprochement** : Marquez vos transactions comme "vérifiées" pour une comptabilité sans faille.
- **Local-First & Résilience** : Stockage IndexedDB ultra-rapide avec système d'import/export structuré.

## 🛠️ Stack Technique (Updated)
- **Frontend** : React 19 + Vite + TypeScript.
- **Styling** : **Tailwind CSS** (Migration complète) + Framer Motion.
- **UI Components** : **shadcn/ui**.
- **Forms & Validation** : **React Hook Form** + **Zod**.
- **State Management** : **TanStack Query** (React Query).
- **Icons** : Lucide React.
- **Database** : Drizzle ORM + IndexedDB (Local-first).

## 🏗️ Refactoring Récent
- **Migration Tailwind CSS** : Tous les styles inline et CSS legacy ont été remplacés par Tailwind pour une maintenance facilitée et une cohérence visuelle parfaite.
- **Standardisation des Formulaires** : Passage à `react-hook-form` avec validation `Zod` pour une robustesse accrue.
- **Composants shadcn** : Intégration des standards de l'industrie pour les éléments d'interface.

## 📦 Installation
```bash
# Installer les dépendances
npm install

# Lancer l'application
npm run dev
```

## 🏗️ Build
```bash
# Générer le bundle de production
npm run build
```

## 📜 Licence
Ce projet est sous licence **MIT**.

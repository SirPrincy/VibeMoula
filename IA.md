# IA.md - VibeMoula Project Context

Ce document permet à une autre IA de comprendre l'état actuel et la philosophie de **VibeMoula**.

## Vision du Produit
Une application de gestion financière ultra-minimaliste, esthétique et performante.
- **Design Philosophy** : "Soft Editorial" - arrondis équilibrés (24px), typographie `Outfit`, contrastes forts, et glassmorphism.
- **UX** : Focus sur la rapidité d'entrée des données et la clarté des soldes.

## Stack Technique (V9 - Drizzle & TypeScript)
- **Frontend** : React 18 + Vite + TypeScript.
- **Backend/API** : Node.js + Express + **TypeScript (via `tsx`)**.
- **Base de données** : SQLite géré par **Drizzle ORM**.
- **Communication** : Centralisation du state dans `/src/hooks/useFinance.ts` qui communique avec le backend via fetch.

## Structure Clé
- `/src/components/FinanceView.tsx` : Gestion unifiée des wallets et solde global.
- `/src/components/DashboardView.tsx` : Analyses et graphiques (Trends SVG).
- `/src/db/schema.ts` : Définition du schéma de la base de données (Drizzle).
- `server.ts` : Backend CRUD type-safe avec Drizzle ORM.

## Décisions de Design & Features (Phase 12+)
- **Transactions Avancées** : Support des **Sous-catégories** (dynamiques selon la catégorie) et des **Tags** (stockés en JSON).
- **UX Transaction** : Modal ordonné (Montant/Wallet -> Catégorie/Sub -> Type/Tags -> Description) avec selects optimisés pour le mode sombre.
- **Data Management** : "Zone de Danger" dans les réglages permettant un reset complet de la base de données.
- **Responsive Navigation** : Navbar flottante (Mobile) et Sidebar latérale (Desktop).

## Roadmap Prochaine
1. **TanStack Query** : Migrer les fetchs du frontend vers React Query pour une synchro de données plus fluide.
2. **Visualisation (Pie Chart)** : Répartition par catégories sur le Dashboard.
3. **Zod Validation** : Partager les schémas de validation entre le frontend et le backend.
4. **Recherche & Filtres** : Recherche textuelle dans l'historique des transactions.


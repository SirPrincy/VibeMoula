# IA.md - VibeMoula Project Context

Ce document permet à une autre IA de comprendre l'état actuel et la philosophie de **VibeMoula**.

## Vision du Produit
Une application de gestion financière ultra-minimaliste, esthétique et performante.
- **Design Philosophy** : "Soft Editorial" - arrondis équilibrés (24px), typographie `Outfit`, contrastes forts, et glassmorphism.
- **UX** : Focus sur la rapidité d'entrée des données et la clarté des soldes.

## Stack Technique (V10 - Resilience & Query)
- **Frontend** : React 18 + Vite + TypeScript + **TanStack Query (React Query)**.
- **Backend/API** : Node.js + Express + TypeScript. Sécurisé avec **Helmet**, **Rate Limiting** et **Zod validation**.
- **Base de données** : SQLite géré par **Drizzle ORM**.
- **Services** : 
  - `importExportService` (V2 JSON structured)
  - `recurringService` (Automation des transactions)
  - `currencyService` (Consolidation multi-devises)

## Structure Clé
- `/src/hooks/queries/useFinanceQueries.ts` : Fetching et mutations optimistes via React Query.
- `/src/services/` : Logique métier extraite du state.
- `/src/db/schema.ts` : Tables `categories`, `budgets`, `recurring_templates` ajoutées en Phase 2.
- `server.ts` : Backend CRUD type-safe avec Drizzle ORM.

## Décisions de Design & Features (Phase 13+)
- **Résilience V2** : Import/Export versionné pour éviter les ruptures de schéma.
- **Budgeting** : Suivi mensuel par catégorie avec progress bars dynamiques.
- **Consolidation** : Dashboard unifié convertissant tous les wallets dans la devise de référence.
- **Rapprochement** : Statut `isReconciled` pour valider l'intégrité des comptes.
- **Navigation** : Système de sous-onglets (Comptes, Budgets, Catégories) dans FinanceView.

## Prochaines Étapes
1. **Analyses Avancées** : Graphiques de répartition des dépenses par catégorie (Pie Chart).
2. **Filtres & Recherche** : Recherche plein texte dans l'historique.
3. **Synchronisation Cloud** : Option de backup chiffré vers un provider externe.

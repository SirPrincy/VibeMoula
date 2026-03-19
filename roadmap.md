Analyse ce code frontend et propose un plan pour centraliser les validations et les types afin d’éviter les doublons et divergences.

Problème : plusieurs sources de vérité coexistent :
- src/types/index.ts
- src/lib/schemas.ts
- SUB_CATEGORIES local dans TransactionModal

Conséquences :
- duplication métier
- risque de drift entre types et schémas
- maintenance coûteuse

Exemple : les schémas Zod existent, mais le formulaire transaction ne les utilise pas et parse le montant à la main.

Fournis un plan concret avec :
1. Une stratégie pour avoir une seule source de vérité
2. Comment utiliser Zod pour générer types TypeScript et validations front/back
3. Exemple de refactorisation pour TransactionModal
4. Les bénéfices pour la maintenabilité et la cohérence

Analyse le code UI et propose un plan pour améliorer la maintenabilité des styles.

Problème :
- Beaucoup de styles inline dans App, DashboardView, FinanceView, TransactionModal, Navbar
- Duplication visuelle, surcharge des composants, JSX moins lisible
- Difficultés à factoriser tokens/design system et industrialiser theming/accessibilité
- La stack utilise Tailwind/shadcn, mais le code n’en profite pas vraiment

Fournis un plan concret avec :
1. Comment remplacer les styles inline par des classes Tailwind/shadcn
2. Organisation des tokens/design system
3. Exemple de refactorisation sur un composant clé
4. Les avantages pour lisibilité, maintenabilité et theming

Analyse la cohérence technique du projet et propose un plan pour aligner la stack et la documentation.

Problèmes :
- Le README annonce React 18, mais le projet utilise React 19
- La stack inclut react-hook-form, @hookform/resolvers, next-themes, shadcn, Radix, mais l’implémentation reste très artisanale
- Base semi-migrée et pas totalement stabilisée

Fournis un plan concret avec :
1. Vérification et mise à jour des dépendances
2. Standardisation des patterns pour l’implémentation (formulaires, thèmes, composants)
3. Alignement README, documentation et réalité du code
4. Avantages pour cohérence, onboarding et stabilité future
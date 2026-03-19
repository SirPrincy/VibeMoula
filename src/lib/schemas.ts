import { z } from 'zod';

export const CATEGORIES = ['food', 'shopping', 'transport', 'home', 'salary', 'leisure', 'other'] as const;
export type Category = typeof CATEGORIES[number];

export const CATEGORY_TYPES = ['income', 'expense'] as const;
export type CategoryType = typeof CATEGORY_TYPES[number];

export const TRANSACTION_TYPES = ['income', 'expense', 'transfer'] as const;
export type TransactionType = typeof TRANSACTION_TYPES[number];

export const SUB_CATEGORIES: Record<string, string[]> = {
    food: ['Resto', 'Courses', 'Café', 'Snacks'],
    shopping: ['Vêtements', 'Tech', 'Maison', 'Cadeaux'],
    transport: ['Carburant', 'Bus/Métro', 'Taxi/Uber'],
    home: ['Loyer', 'Électricité', 'Eau', 'Internet'],
    salary: ['Salaire Principal', 'Bonus', 'Freelance'],
    leisure: ['Cinéma', 'Sport', 'Voyage', 'Sorties'],
    other: ['Divers'],
};

// Transaction schema
export const transactionSchema = z.object({
    amount: z.coerce.number({ message: 'Le montant est requis' }).positive('Le montant doit être positif'),
    walletId: z.string({ message: 'Le wallet est requis' }).min(1, 'Sélectionnez un wallet'),
    categoryId: z.string().optional(),
    category: z.string({ message: 'La catégorie est requise' }),
    subCategory: z.string().optional(),
    type: z.enum(TRANSACTION_TYPES, { message: 'Le type est requis' }),
    tags: z.array(z.string()).default([]),
    description: z.string().optional(),
    date: z.string().default(() => new Date().toISOString()),
    isReconciled: z.boolean().default(false),
    fromWalletId: z.string().optional(),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;

// Wallet schema
export const walletSchema = z.object({
    name: z.string({ message: 'Le nom est requis' }).min(1, 'Le nom est requis'),
    icon: z.string().default('💰'),
    currency: z.string({ message: 'La devise est requise' }).min(1, 'La devise est requise'),
});

export type WalletFormData = z.infer<typeof walletSchema>;

// Savings schema
export const savingsSchema = z.object({
    name: z.string().min(1, 'Le nom est requis'),
    target: z.number().positive('L\'objectif doit être positif'),
    current: z.number().min(0, 'Le montant actuel ne peut pas être négatif'),
    currency: z.string().min(1, 'La devise est requise'),
    deadline: z.string().optional(),
});

export type SavingsFormData = z.infer<typeof savingsSchema>;

// Debt schema
export const debtSchema = z.object({
    title: z.string().min(1, 'Le titre est requis'),
    amount: z.number().positive('Le montant doit être positif'),
    remaining: z.number().min(0, 'Le restant ne peut pas être négatif'),
    currency: z.string().min(1, 'La devise est requise'),
    dueDate: z.string().optional(),
    isPaid: z.boolean().default(false),
});

export type DebtFormData = z.infer<typeof debtSchema>;

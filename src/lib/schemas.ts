import { z } from 'zod';

export const CATEGORIES = ['food', 'shopping', 'transport', 'home', 'salary', 'leisure', 'other'] as const;
export type Category = typeof CATEGORIES[number];

export const TRANSACTION_TYPES = ['income', 'expense'] as const;
export type TransactionType = typeof TRANSACTION_TYPES[number];

export const SUB_CATEGORIES: Record<Category, string[]> = {
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
    amount: z.number({ required_error: 'Le montant est requis' }).positive('Le montant doit être positif'),
    walletId: z.string({ required_error: 'Le wallet est requis' }).min(1, 'Sélectionnez un wallet'),
    category: z.enum(CATEGORIES, { required_error: 'La catégorie est requise' }),
    subCategory: z.string({ required_error: 'La sous-catégorie est requise' }).min(1, 'Sélectionnez une sous-catégorie'),
    type: z.enum(TRANSACTION_TYPES, { required_error: 'Le type est requis' }),
    tags: z.string().optional(),
    description: z.string().optional(),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;

// Wallet schema
export const walletSchema = z.object({
    name: z.string({ required_error: 'Le nom est requis' }).min(1, 'Le nom est requis'),
    icon: z.string().default('💰'),
    currency: z.string({ required_error: 'La devise est requise' }).min(1, 'La devise est requise'),
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

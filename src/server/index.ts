import express, { type Request, type Response } from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as schema from '../db/schema.ts';
import { eq, desc } from 'drizzle-orm';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { validate } from './middleware/validate.ts';
import { checkApiKey } from './middleware/auth.ts';
import { errorHandler } from './middleware/error.ts';
import * as schemas from './schemas.ts';

const app = express();
const port = 3001;

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.VIBEMOULA_FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-admin-key']
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { status: 'error', message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

app.use(express.json());

// Initialisation de la base de données avec Drizzle
const sqlite = new Database('database.sqlite');
const db = drizzle(sqlite, { schema });

// Appliquer les migrations au démarrage
migrate(db, { migrationsFolder: './drizzle' });
console.log('Migrations applied successfully');

// Routes API Wallets
app.get('/api/wallets', async (_req: Request, res: Response) => {
  try {
    const allWallets = await db.select().from(schema.wallets);
    res.json(allWallets);
  } catch (error) {
    console.error('Error fetching wallets:', error);
    res.status(500).json({ error: 'Failed to fetch wallets' });
  }
});

app.post('/api/wallets', validate(schemas.WalletSchema), async (req: Request, res: Response) => {
  const { id, name, icon, currency } = req.body;
  await db.insert(schema.wallets).values({ 
    id: id as string, 
    name: name as string, 
    icon: icon as string, 
    currency: currency as string 
  });
  res.status(201).json({ id, name, icon, currency });
});

// Routes API Transactions
app.get('/api/transactions', async (_req: Request, res: Response) => {
  try {
    const transactions = await db.select()
      .from(schema.transactions)
      .orderBy(desc(schema.transactions.date));
      
    const formattedTransactions = transactions.map(t => ({
      ...t,
      tags: t.tags ? JSON.parse(t.tags) : []
    }));
    res.json(formattedTransactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

app.post('/api/transactions', validate(schemas.TransactionSchema), async (req: Request, res: Response) => {
  console.log('Incoming transaction request:', req.body);
  const { id, description, amount, category, subCategory, tags, type, walletId, date } = req.body;
  const tagsStr = tags ? JSON.stringify(tags) : null;
  
  await db.insert(schema.transactions).values({ 
    id: id as string, 
    description: description as string | null, 
    amount: Number(amount), 
    category: category as string, 
    subCategory: subCategory as string | null, 
    tags: tagsStr, 
    type: type as "income" | "expense", 
    walletId: walletId as string, 
    date: date as string 
  });
  
  console.log('Transaction created successfully:', id);
  res.status(201).json({ id, description, amount, category, subCategory, tags, type, walletId, date });
});

app.delete('/api/transactions/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await db.delete(schema.transactions).where(eq(schema.transactions.id, id));
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

app.delete('/api/transactions', async (_req: Request, res: Response) => {
  try {
    await db.delete(schema.transactions);
    res.status(204).end();
  } catch (error) {
    console.error('Error clearing transactions:', error);
    res.status(500).json({ error: 'Failed to clear transactions' });
  }
});

// Routes API Savings
app.get('/api/savings', async (_req: Request, res: Response) => {
  try {
    const allSavings = await db.select().from(schema.savings);
    res.json(allSavings);
  } catch (error) {
    console.error('Error fetching savings:', error);
    res.status(500).json({ error: 'Failed to fetch savings' });
  }
});

app.post('/api/savings', validate(schemas.SavingsSchema), async (req: Request, res: Response) => {
  const { id, name, target, current, currency, deadline } = req.body;
  await db.insert(schema.savings).values({ 
    id: id as string, 
    name: name as string, 
    target: Number(target), 
    current: Number(current), 
    currency: currency as string, 
    deadline: deadline as string | null 
  });
  res.status(201).json({ id, name, target, current, currency, deadline });
});

app.put('/api/savings/:id', validate(schemas.SavingsSchema), async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { name, target, current, currency, deadline } = req.body;
  await db.update(schema.savings)
    .set({ 
      name: name as string, 
      target: Number(target), 
      current: Number(current), 
      currency: currency as string, 
      deadline: deadline as string | null 
    })
    .where(eq(schema.savings.id, id));
  res.json({ id, name, target, current, currency, deadline });
});

app.delete('/api/savings/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await db.delete(schema.savings).where(eq(schema.savings.id, id));
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting savings goal:', error);
    res.status(500).json({ error: 'Failed to delete savings goal' });
  }
});

// Routes API Debts
app.get('/api/debts', async (_req: Request, res: Response) => {
  try {
    const allDebts = await db.select().from(schema.debts);
    res.json(allDebts);
  } catch (error) {
    console.error('Error fetching debts:', error);
    res.status(500).json({ error: 'Failed to fetch debts' });
  }
});

app.post('/api/debts', validate(schemas.DebtSchema), async (req: Request, res: Response) => {
  const { id, title, amount, remaining, currency, dueDate, isPaid } = req.body;
  await db.insert(schema.debts).values({ 
    id: id as string, 
    title: title as string, 
    amount: Number(amount), 
    remaining: Number(remaining), 
    currency: currency as string, 
    dueDate: dueDate as string | null, 
    isPaid: !!isPaid 
  });
  res.status(201).json({ id, title, amount, remaining, currency, dueDate, isPaid });
});

app.put('/api/debts/:id', validate(schemas.DebtSchema), async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { title, amount, remaining, currency, dueDate, isPaid } = req.body;
  await db.update(schema.debts)
    .set({ 
      title: title as string, 
      amount: Number(amount), 
      remaining: Number(remaining), 
      currency: currency as string, 
      dueDate: dueDate as string | null, 
      isPaid: !!isPaid 
    })
    .where(eq(schema.debts.id, id));
  res.json({ id, title, amount, remaining, currency, dueDate, isPaid });
});

app.delete('/api/debts/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await db.delete(schema.debts).where(eq(schema.debts.id, id));
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting debt:', error);
    res.status(500).json({ error: 'Failed to delete debt' });
  }
});

app.delete('/api/reset', checkApiKey, async (_req: Request, res: Response) => {
  await db.delete(schema.transactions);
  await db.delete(schema.wallets);
  await db.delete(schema.savings);
  await db.delete(schema.debts);
  res.status(204).end();
});

// Error Handling
app.use(errorHandler);

app.listen(port, () => {
  console.log(`VibeMoula Backend (Drizzle) running at http://localhost:${port}`);
});


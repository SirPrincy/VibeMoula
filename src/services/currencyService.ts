import type { Currency } from '../types';

// Simplified exchange rate service (in production, fetch from an API)
const EXCHANGE_RATES: Record<string, number> = {
  'USD': 1,
  'EUR': 0.92,
  'FCFA': 605,
  'Ar': 4500,
  'CAD': 1.35,
  'CHF': 0.88,
  'GBP': 0.79,
};

export const currencyService = {
  convert: (amount: number, from: Currency, to: Currency): number => {
    if (from === to) return amount;
    
    const amountInUSD = amount / (EXCHANGE_RATES[from] || 1);
    return amountInUSD * (EXCHANGE_RATES[to] || 1);
  },

  format: (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency === 'FCFA' ? 'XOF' : currency,
      minimumFractionDigits: 0,
    }).format(amount);
  },

  getExchangeRates: () => EXCHANGE_RATES,
};

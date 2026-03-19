export const persistenceService = {
  getCurrency: () => localStorage.getItem('vibemoula_currency') || 'USD',
  setCurrency: (currency: string) => localStorage.setItem('vibemoula_currency', currency),
  
  getTheme: () => localStorage.getItem('theme') || 'light',
  setTheme: (theme: string) => localStorage.setItem('theme', theme),
};

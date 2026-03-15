export const formatCurrency = (amount: number, currency: string) => {
  const formatted = amount.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  if (currency === 'USD' || currency === '$') {
    return `$${formatted}`;
  }
  if (currency === 'EUR' || currency === '€') {
    return `€${formatted}`;
  }
  if (currency === 'GBP' || currency === '£') {
    return `£${formatted}`;
  }
  
  return `${formatted} ${currency}`;
};

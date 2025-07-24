export const formatCurrency = (value: number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return 'Rp 0';
  }
  return 'Rp ' + new Intl.NumberFormat('id-ID').format(Math.round(value));
};

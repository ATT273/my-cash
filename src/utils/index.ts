export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US").format(amount);
};

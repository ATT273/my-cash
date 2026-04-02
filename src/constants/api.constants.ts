const BASE = "/api";

// Auth
export const AUTH_ROUTES = {
  REGISTER: `${BASE}/auth/register`,
  SIGNIN: `${BASE}/auth/signin`,
  SIGNOUT: `${BASE}/auth/signout`,
  VERIFY: `${BASE}/auth/verify`,
};

// Transactions
export const TRANSACTION_ROUTES = {
  BASE: `${BASE}/transactions`,
  BY_ID: (id: string) => `${BASE}/transactions/${id}`,
  SEARCH: `${BASE}/transactions/search`,
  SUMMARY_MONTHLY: `${BASE}/transactions/summary/monthly`,
  SUMMARY_YEARLY: `${BASE}/transactions/summary/yearly`,
};

// Wallets
export const WALLET_ROUTES = {
  BASE: `${BASE}/wallets`,
  BY_ID: (id: string) => `${BASE}/wallets/${id}`,
  BY_USER: (userId: string) => `${BASE}/wallets/by-user/${userId}`,
};

// Budgets
export const BUDGET_ROUTES = {
  BASE: `${BASE}/budgets`,
  BY_WALLET: (walletId: string) => `${BASE}/budgets/by-wallet/${walletId}`,
  LIST_BY_WALLET: (walletId: string) => `${BASE}/budgets/list/${walletId}`,
  ARCHIVE: (id: string) => `${BASE}/budgets/${id}/archive`,
};

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
  SUMMARY_MONTHLY: `${BASE}/transactions/summary/monthly`,
  SUMMARY_YEARLY: `${BASE}/transactions/summary/yearly`,
};

// Wallets
export const WALLET_ROUTES = {
  BASE: `${BASE}/wallets`,
  BY_ID: (id: string) => `${BASE}/wallets/${id}`,
  BY_USER: (userId: string) => `${BASE}/wallets/by-user/${userId}`,
};

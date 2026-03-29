import { useState, useEffect } from "react";

const CURRENT_WALLET_KEY = "my_cash_current_wallet_id";
const WALLET_CHANGE_EVENT = "walletChanged";

export const useCurrentWallet = () => {
  const [currentWalletId, setCurrentWalletId] = useState<string>(
    () => (typeof window !== "undefined" ? localStorage.getItem(CURRENT_WALLET_KEY) ?? "" : "")
  );

  useEffect(() => {
    const handleWalletChange = (e: Event) => {
      setCurrentWalletId((e as CustomEvent<{ walletId: string }>).detail.walletId);
    };
    window.addEventListener(WALLET_CHANGE_EVENT, handleWalletChange);
    return () => window.removeEventListener(WALLET_CHANGE_EVENT, handleWalletChange);
  }, []);

  const selectWallet = (walletId: string) => {
    localStorage.setItem(CURRENT_WALLET_KEY, walletId);
    setCurrentWalletId(walletId);
    window.dispatchEvent(new CustomEvent(WALLET_CHANGE_EVENT, { detail: { walletId } }));
  };

  return { currentWalletId, selectWallet };
};

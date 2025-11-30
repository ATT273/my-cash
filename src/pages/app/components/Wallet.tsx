import React, { useEffect } from "react";

const Wallet = () => {
  useEffect(() => {
    const wallet = localStorage.getItem("my_cash_wallet");
    if (wallet) {
      const walletData = JSON.parse(wallet);
    }
  }, []);
  return <div>Wallet</div>;
};

export default Wallet;

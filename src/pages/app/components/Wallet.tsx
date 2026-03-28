"use client";

import { useEffect } from "react";

const Wallet = () => {
  
  useEffect(() => {
    const wallet = localStorage.getItem("my_cash_wallet");
    if (wallet) {
      JSON.parse(wallet);
    }
  }, []);
  return <div>Wallet</div>;
};

export default Wallet;

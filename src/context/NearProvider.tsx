"use client";

import { NearWallet } from "@/services/near-wallet";
import { useEffect, useState } from "react";
import { NearContext } from "./context";
import { Wallet } from "@near-wallet-selector/core";

// NEAR WALLET
const wallet = new NearWallet({
  networkId: "mainnet",
  createAccessKeyFor: "v1.signer",
});

export function NearProvider({ children }: { children: React.ReactNode }) {
  const [signedAccountId, setSignedAccountId] = useState("");
  const [signedInWallet, setSignedInWallet] = useState<Wallet>();

  useEffect(() => {
    wallet.startUp(setSignedAccountId, setSignedInWallet);
  }, [signedAccountId]);

  return (
    // @ts-ignore
    <NearContext.Provider value={{ wallet, signedAccountId, signedInWallet }}>
      {children}
    </NearContext.Provider>
  );
}

import { createContext } from "react";
import { NearWallet } from "@/services/near-wallet";

export const NearContext = createContext({
  wallet: NearWallet,
  signedAccountId: "",
  signedInWallet: undefined,
});

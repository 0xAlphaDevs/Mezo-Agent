import { useBitteWallet, Wallet } from "@bitte-ai/react";
import { BitteWidgetChat } from "@bitte-ai/chat";
import { useEffect, useState } from "react";
import type { Account } from "@near-wallet-selector/core";
import '@bitte-ai/chat/styles.css';

export default function ChatWidget() {
  const [wallet, setWallet] = useState<Wallet>();
  const [account, setAccount] = useState<Account>();
  const [accountId, setAccountId] = useState<string>("");
  const [nearWalletId, setNearWalletId] = useState<string>();


  return (
    <BitteWidgetChat
      agentId="bitcoin-agent.xyz"
      apiUrl="/api/chat"
      wallet={{
        near: {
          wallet,
          accountId,
          nearWalletId,
        },
      }}
    />
  );
}
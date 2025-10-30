"use client";

import React from "react";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider, type Config } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getConfig, mezoTestnet } from "@mezo-org/passport";

const queryClient = new QueryClient();

const wagmiConfig = getConfig({
  appName: "Your DApp Name",
  chains: [mezoTestnet],
});


interface MezoProvidersProps {
  children: React.ReactNode;
}

export function MezoProviders({ children }: MezoProvidersProps) {
  return (
    <React.StrictMode>
      <WagmiProvider config={wagmiConfig as any}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider initialChain={mezoTestnet}>
            {children}
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </React.StrictMode>
  );
}

"use client";

import { wagmiAdapter, projectId, mezoTestnet } from "@/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import React, { type ReactNode } from "react";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

// Set up queryClient
const queryClient = new QueryClient();

if (!projectId) {
  throw new Error("Project ID is not defined");
}

// Set up metadata
// const metadata = {
//   name: 'Mezo Agent',
//   description: 'AppKit Example',
//   url: 'https://appkitexampleapp.com', // origin must match your domain & subdomain
//   icons: ['https://avatars.githubusercontent.com/u/179229932']
// }

// Create the modal
// const modal = createAppKit({
//   adapters: [wagmiAdapter],
//   projectId,
//   networks: [mezoTestnet],
//   defaultNetwork: mezoTestnet,
//   metadata: metadata,
//   features: {
//     analytics: true // Optional - defaults to your Cloud configuration
//   }
// })

function MezoProvider({ children }: { children: ReactNode }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config);

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider initialChain={mezoTestnet}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MezoProvider;

"use client";
import { WagmiProvider, http } from "wagmi";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "@rainbow-me/rainbowkit/styles.css";
import { defineChain } from "viem";

const anvil = defineChain({
  id: 31337,
  name: "Anvil Local",
  network: "anvil",
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  },
  rpcUrls: {
    default: { http: ["http://10.10.10.122:8545"] }, // 改成你的 anvil IP
    public: { http: ["http://10.10.10.122:8545"] },
  },
  blockExplorers: {
    default: { name: "None", url: "http://10.10.10.122:5100" },
  },
});

const config = getDefaultConfig({
  appName: "My First Wallet",
  projectId: "YOUR_WALLETCONNECT_PROJECT_ID",
  chains: [anvil],
  transports: {
    [anvil.id]: http("http://10.10.10.122:8545"),
  },
  ssr: true,
});

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

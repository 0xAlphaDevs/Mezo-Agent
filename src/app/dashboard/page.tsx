"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bitcoin,
  Copy,
  ExternalLink,
  RefreshCw,
  Wallet,
  CheckIcon,
  Bot,
  Github,
} from "lucide-react";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

type Balance = {
  balance: string;
  decimals: number;
  symbol: string;
};

type BalanceResponse = {
  btcBalance: Balance;
  musdBalance: Balance;
  address: string;
};

export default function Dashboard() {
  const [copied, setCopied] = useState(false);
  const [balances, setBalances] = useState<BalanceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Wagmi hooks
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected && address) {
      fetchBalances();
    }
  }, [isConnected, address]);

  const fetchBalances = async () => {
    if (!address) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/tools/get-balances', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch balances');
      }

      const data: BalanceResponse = await response.json();
      setBalances(data);
    } catch (error) {
      console.error('Error fetching balances:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // const signIn = () => {
  //   //@ts-ignore
  //   wallet.signIn();
  // };


  return (
    <div>
      <div className="bg-white text-black min-h-screen">
        {/* Header */}
        <header className="border-b border-rose-900/50 bg-white/90 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="flex items-center gap-0 text-xl font-bold"
              >
                <Image
                  src="/icon.png"
                  alt="Logo"
                  width={30}
                  height={30}
                  className="rounded-full"
                />
                <span className="ml-2">
                  Mezo <span className="text-rose-500">Agent</span>
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <ConnectButton />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600 mb-8">
            Manage your wallet and transactions
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Assets Card */}
            {isConnected ? (
              <Card className="border-rose-900/50 bg-white/60 backdrop-blur-sm col-span-1 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-black">
                    <Wallet className="h-5 w-5 text-rose-500" />
                    Assets
                  </CardTitle>
                  <CardDescription>
                    Your digital assets on Bitcoin mainnet and Mezo Testnet
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Wallet Address */}
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600 mb-4">
                      Wallet Address
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-rose-900/20 text-black p-3 rounded-md flex-1 font-mono text-sm break-all">
                        {address}
                      </div>
                      <Button
                        size="icon"
                        variant="outline"
                        className="border-rose-900/50 hover:border-rose-500 hover:text-rose-500"
                        onClick={() => {
                          navigator.clipboard.writeText(address || '');
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                      >
                        {copied ? (
                          <CheckIcon className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Asset Balances */}
                  <div className="space-y-4">
                    <div className="text-sm text-gray-600 mb-4">
                      Asset Balances
                    </div>

                    {isLoading ? (
                      <div className="space-y-4">
                        <div className="h-20 bg-gray-200 animate-pulse rounded-md"></div>
                        <div className="h-20 bg-gray-200 animate-pulse rounded-md"></div>
                      </div>
                    ) : (
                      <>
                        {/* MUSD Balance */}
                        <div className="flex items-center gap-4 p-4 bg-rose-900/10 rounded-md">
                          <div className="bg-rose-900/20 p-3 rounded-md">
                            <span className="text-lg font-bold text-rose-500">M</span>
                          </div>
                          <div className="flex-1">
                            <div className="text-lg font-bold text-black">
                              {balances
                                ? (parseFloat(balances.musdBalance.balance) / Math.pow(10, balances.musdBalance.decimals)).toFixed(4)
                                : '0.0000'
                              } MUSD
                            </div>
                            <div className="text-sm text-gray-600">
                              Mezo USD Stablecoin
                            </div>
                          </div>
                        </div>

                        {/* BTC Balance */}
                        <div className="flex items-center gap-4 p-4 bg-rose-900/10 rounded-md">
                          <div className="bg-rose-900/20 p-3 rounded-md">
                            <Bitcoin className="h-6 w-6 text-rose-500" />
                          </div>
                          <div className="flex-1">
                            <div className="text-lg font-bold text-black">
                              {balances
                                ? (parseFloat(balances.btcBalance.balance) / Math.pow(10, balances.btcBalance.decimals)).toFixed(8)
                                : 'Not fectched'
                              } BTC
                            </div>
                            <div className="text-sm text-gray-600">
                              Bitcoin on Mezo Testnet
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between border-t border-rose-900/30 pt-4">
                  <Button
                    variant="outline"
                    className="border-rose-900/50 hover:border-rose-500 hover:text-rose-500"
                    onClick={() =>
                      window.open(
                        `https://testnet.mezo.org/overview`,
                        "_blank"
                      )
                    }
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Go to Mezo Dashboard
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <Card className="border-rose-900/50 bg-white/60 backdrop-blur-sm col-span-1 lg:col-span-2 flex items-center justify-center p-8">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
                  <p className="text-gray-600 mb-4">Connect your wallet to view your assets</p>
                  <ConnectButton />
                </div>
              </Card>
            )}

            {/* Network Info Card */}
            <Card className="border-rose-900/50 bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black">
                  <Bot className="h-5 w-5 text-rose-500" />
                  Network Status
                </CardTitle>
                <CardDescription>
                  Connected networks and their status
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                  <span className="text-lg text-gray-600">Online</span>
                </div>

                <div className="text-sm text-gray-600">
                  <p className="mb-2">
                    Connected to multiple networks for seamless asset management and transactions.
                  </p>
                </div>

                <div className="bg-rose-900/20 p-3 rounded-md mt-4">
                  <h4 className="text-sm font-medium mb-2 text-black">
                    Available Networks
                  </h4>
                  <p className="text-xs text-gray-500 mb-2">
                    Currently connected to the following networks
                  </p>
                  <div className="flex flex-col gap-2">
                    <Badge className="bg-rose-900/50 text-rose-400 w-fit">
                      Bitcoin Mainnet
                    </Badge>
                    <Badge className="bg-rose-900/50 text-rose-400 w-fit">
                      Mezo Testnet
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* <TransactionHistory btcPrice={bitcoinPrice} /> */}
        </main>

        {/* Footer */}
        <footer className="border-t border-rose-900/50 py-4 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between gap-8">
              {/* Logo and Copyright */}
              <div className="flex flex-col">
                <h3 className="text-xl font-bold mb-4">
                  Mezo <span className="text-rose-500">Agent</span>
                </h3>
                <a
                  href="https://www.alphadevs.dev/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-600 text-sm"
                >
                  © Team AlphaDevs
                </a>
              </div>

              {/* Social Links */}
              <div className="flex flex-col">
                <h3 className="text-lg font-bold mb-4">Connect With Us</h3>
                <div className="flex gap-4">
                  <Link
                    href="https://x.com/0xAlphaDevs"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-gray-600 hover:text-rose-500 transition-colors"
                  >
                    <Image src="/x.png" alt="X" width={26} height={26} />
                  </Link>
                  <Link
                    href="https://github.com/0xAlphaDevs"
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-600 hover:text-rose-500 transition-colors"
                  >
                    <Github className="h-5 w-5 " />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
      <div
        style={{
          position: "fixed",
          bottom: "32px",
          right: "32px",
          width: "500px",
          height: "600px",
          zIndex: 1000,
          pointerEvents: "none", // allow clicks to pass through by default
        }}
      >
        <iframe
          src="/widget-iframe"
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "16px",
            pointerEvents: "auto", // allow interaction with the widget
          }}
          title="Chat Widget"
        />
      </div>
    </div>
  );
}

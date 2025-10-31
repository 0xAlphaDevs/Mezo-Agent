"use client";

import { useState, useEffect, useContext } from "react";
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
  ArrowLeft,
  Bitcoin,
  Copy,
  ExternalLink,
  RefreshCw,
  Wallet,
  CheckIcon,
  Bot,
  Github,
  QrCode,
} from "lucide-react";
import Image from "next/image";
import { NearContext } from "@/context/context";
import { connect, utils } from "near-api-js";
// import TransactionHistory from "@/components/dashboard/TransactionHistory";
import { QRCodeCanvas } from "qrcode.react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import ChatWidget from "@/components/ChatWidget";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Dashboard() {
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [nearBalance, setNearBalance] = useState(0);
  const [btcBalance, setBtcBalance] = useState(0);
  const [btcAddress, setBtcAddress] = useState("...");
  const [bitcoinPrice, setBitcoinPrice] = useState(0);

  // NEAR Context
  const { wallet, signedAccountId } = useContext(NearContext);

  // const signIn = () => {
  //   //@ts-ignore
  //   wallet.signIn();
  // };

  useEffect(() => {
    setIsLoading(true);
    if (signedAccountId) {
      loadData();
    } else {
      setIsLoading(false);
    }
  }, [signedAccountId]);

  async function loadData() {
    await getUser(signedAccountId);
    await getNearAccountBalance();
    await getBitcoinPrice();
    setIsLoading(false);
  }

  async function getUser(signedAccountId: string) {
    const mbMetadata = {
      accountId: signedAccountId,
    };

    const response = await fetch("/api/tools/get-btc-balance", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "mb-metadata": JSON.stringify(mbMetadata),
      },
    });

    if (!response.ok) {
      console.error("Error fetching user data:", response.statusText);
      return;
    }
    const data = await response.json();
    setBtcAddress(data.btcAddress);
    setBtcBalance(data.btcBalance / 1e8);
  }

  async function getNearAccountBalance() {
    const connectionConfig = {
      networkId: "mainnet",
      nodeUrl: "https://rpc.mainnet.near.org",
    };
    const nearConnection = await connect(connectionConfig);
    // gets account balance
    const account = await nearConnection.account(signedAccountId);
    const response = await account.getAccountBalance();
    const balance = utils.format.formatNearAmount(response.total, 5);
    setNearBalance(parseFloat(balance));
  }

  async function getBitcoinPrice() {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
    );
    const data = await response.json();
    setBitcoinPrice(data.bitcoin.usd);
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(btcAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="bg-black text-white min-h-screen">
        {/* Header */}
        <header className="border-b border-emerald-900/50 bg-black/90 backdrop-blur-sm sticky top-0 z-50">
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
                  Mezo <span className="text-emerald-500">Agent</span>
                </span>
              </Link>
            </div>

            {signedAccountId && (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                  <p className="text-sm font-medium text-gray-400">
                    {nearBalance.toFixed(3)}{" "}
                    <span className="text-xs">NEAR</span>{" "}
                  </p>
                  <p className="text-xs text-gray-400 truncate max-w-[120px] sm:max-w-[180px]">
                    {signedAccountId}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-red-900 hover:border-red-500 text-red-500 hover:text-red-500"
                  onClick={() => {
                    // @ts-ignore
                    wallet.signOut();
                  }}
                >
                  Disconnect
                </Button>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-400 mb-8">
            Manage your wallet and transactions
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Wallet Info Card */}
            {signedAccountId ? (
              <Card className="border-emerald-900/50 bg-black/60 backdrop-blur-sm col-span-1 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Wallet className="h-5 w-5 text-emerald-500" />
                    Bitcoin Wallet
                  </CardTitle>
                  <CardDescription>
                    Your Bitcoin wallet generated via NEAR chain signatures
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Wallet Address */}
                  <div className="space-y-2">
                    <div className="text-sm text-gray-400 mb-4">
                      Wallet Address
                    </div>
                    {isLoading ? (
                      <div className="h-10 bg-gray-900 animate-pulse rounded-md"></div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="bg-emerald-900/20 text-white p-3 rounded-md flex-1 font-mono text-sm break-all">
                          {btcAddress}
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline">
                              <QrCode className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Scan</DialogTitle>
                              <DialogDescription>
                                Scan the QR code below to get your Bitcoin
                                address.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-center">
                              <QRCodeCanvas value={btcAddress} size={160} />
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          size="icon"
                          variant="outline"
                          className="border-emerald-900/50 hover:border-emerald-500 hover:text-emerald-500"
                          onClick={copyToClipboard}
                        >
                          {copied ? (
                            <CheckIcon className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    )}
                    <div className="text-xs text-gray-500">
                      This address is uniquely generated for your account using
                      NEAR chain signatures
                    </div>
                  </div>

                  {/* Wallet Balance */}
                  <div className="space-y-2">
                    <div className="text-sm text-gray-400 mb-4">
                      Wallet Balance
                    </div>
                    {isLoading ? (
                      <div className="h-16 bg-gray-900 animate-pulse rounded-md"></div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <div className="bg-emerald-900/20 p-4 rounded-md">
                          <Bitcoin className="h-8 w-8 text-emerald-500" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-white">
                            ${(btcBalance * bitcoinPrice).toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-400">
                            {" "}
                            {btcBalance} BTC
                          </div>
                        </div>
                        <Button
                          size="icon"
                          variant="outline"
                          className="ml-auto border-emerald-900/50 hover:border-emerald-500 hover:text-emerald-500"
                          onClick={async () => {
                            setIsLoading(true);
                            await getUser(signedAccountId);
                            await getNearAccountBalance();
                            setIsLoading(false);
                          }}
                        >
                          <RefreshCw
                            className={
                              isLoading ? "animate-spin h-4 w-4" : "h-4 w-4"
                            }
                          />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between border-t border-emerald-900/30 pt-4">
                  <Button
                    variant="outline"
                    className="border-emerald-900/50 hover:border-emerald-500 hover:text-emerald-500"
                    onClick={() =>
                      window.open(
                        `https://mempool.space/address/${btcAddress}`,
                        "_blank"
                      )
                    }
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View on Explorer
                  </Button>
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700 group relative overflow-hidden"
                    onClick={() =>
                      window.open(`https://app.near-intents.org/`, "_blank")
                    }
                  >
                    Fund Wallet
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <Card className="border-emerald-900/50 bg-black/60 backdrop-blur-sm col-span-1 lg:col-span-2 justify-center items-center">
                {/* <Button
                  className="bg-emerald-600 hover:bg-emerald-700 group relative overflow-hidden "
                  onClick={signIn}
                >
                  Connect Wallet
                </Button> */}

                <ConnectButton label="Connect Wallet" />
              </Card>
            )}

            {/* Agent Info Card */}
            <Card className="border-emerald-900/50 bg-black/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Bot className="h-5 w-5 text-emerald-500" />
                  Agent Status
                </CardTitle>
                <CardDescription>
                  Mezo Agent information and status
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-lg text-gray-400">Active</span>
                </div>

                <div className="text-sm text-gray-400">
                  <p className="mb-2">
                    Your Mezo Agent is currently active and ready to sign
                    transactions.
                    {/* running in secure TEE (Trusted
                  Execution Environment) */}
                  </p>
                  {/* <p>
                  The agent uses NEAR chain signatures to securely manage your
                  Bitcoin transactions without requiring you to manage private
                  keys directly.
                </p> */}
                </div>

                <div className="bg-emerald-900/20 p-3 rounded-md mt-4">
                  <h4 className="text-sm font-medium mb-2 text-white">
                    Available Networks
                  </h4>
                  <p className="text-xs text-gray-500 mb-2">
                    The agent is currently working with following networks to
                    sign and send transactions
                  </p>
                  <div className="flex gap-4 ">
                    <Badge className="bg-emerald-900/50 text-emerald-400">
                      Bitcoin Mainnet
                    </Badge>
                    <Badge className="bg-emerald-900/50 text-emerald-400">
                      NEAR Mainnet
                    </Badge>
                  </div>
                </div>
              </CardContent>

              {/* <CardFooter className="border-t border-emerald-900/30 pt-4">
                <Button
                  onClick={() =>
                    window.open(
                      "https://bitte.ai/agents/bitcoin-agent.xyz",
                      "_blank"
                    )
                  }
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  Launch Agent Widget
                </Button>
              </CardFooter> */}
            </Card>
          </div>

          {/* <TransactionHistory btcPrice={bitcoinPrice} /> */}
        </main>

        {/* Footer */}
        <footer className="border-t border-emerald-900/50 py-8 bg-black">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between gap-8">
              {/* Logo and Copyright */}
              <div className="flex flex-col">
                <h3 className="text-xl font-bold mb-4">
                  Bitcoin <span className="text-emerald-500">Agent</span>
                </h3>
                <a
                  href="https://www.alphadevs.dev/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-400 text-sm"
                >
                  © Team AlphaDevs
                </a>
              </div>

              {/* Social Links */}
              <div className="flex flex-col">
                <h3 className="text-lg font-bold mb-4">Connect With Us</h3>
                <div className="flex gap-4">
                  <Link
                    href="https://x.com/btc_near"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-gray-400 hover:text-emerald-500 transition-colors"
                  >
                    <Image src="/x.png" alt="X" width={26} height={26} />
                  </Link>
                  <Link
                    href="https://github.com/0xAlphaDevs/Near-Bitcoin-Agent"
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-400 hover:text-emerald-500 transition-colors"
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

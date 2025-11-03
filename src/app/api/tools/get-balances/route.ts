import { headers } from "next/headers";
import { NextResponse } from "next/server";
import {
  JsonRpcProvider,
  Contract,
  getBytes,
  toUtf8String,
  isAddress,
} from "ethers";

// Mezo testnet configuration
const RPC_URL = "https://rpc.test.mezo.org";
const NETWORK_NAME = "mezo-testnet";
const CHAIN_ID = 31611;
const MUSD_CONTRACT_ADDRESS = "0x118917a40FAF1CD7a13dB0Ef56C86De7973Ac503";

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

// Function to get BTC balance on Mezo testnet using eth_getBalance
async function getBTCBalance(address: string): Promise<Balance> {
  try {
    // Create a JSON-RPC provider for Mezo testnet
    const provider = new JsonRpcProvider(RPC_URL, {
      name: NETWORK_NAME,
      chainId: CHAIN_ID,
    });

    // Get the native token balance (BTC on Mezo testnet)
    const balance = await provider.getBalance(address);

    return {
      balance: balance.toString(),
      decimals: 21,
      symbol: "BTC",
    };
  } catch (error) {
    console.error("Error fetching BTC balance:", error);
    return {
      balance: "0",
      decimals: 18,
      symbol: "BTC",
    };
  }
}

// Function to get MUSD balance on Mezo testnet using ERC-20 contract
async function getMUSDBalance(address: string): Promise<Balance> {
  try {
    // Create a JSON-RPC provider for Mezo testnet
    const provider = new JsonRpcProvider(RPC_URL, {
      name: NETWORK_NAME,
      chainId: CHAIN_ID,
    });

    // ERC-20 ABI for balanceOf function
    const erc20Abi = [
      "function balanceOf(address owner) view returns (uint256)",
    ];

    // Create contract instance
    const contract = new Contract(MUSD_CONTRACT_ADDRESS, erc20Abi, provider);

    // Get the MUSD balance
    const balance = await contract.balanceOf(address);

    return {
      balance: balance.toString(),
      decimals: 18, // MUSD typically uses 18 decimals
      symbol: "MUSD",
    };
  } catch (error) {
    console.error("Error fetching MUSD balance:", error);
    return {
      balance: "0",
      decimals: 18,
      symbol: "MUSD",
    };
  }
}

export async function GET() {
  try {
    const mbMetadataHeader = (await headers()).get("mb-metadata");
    const mbMetadata: { evmAddress: string } =
      mbMetadataHeader && JSON.parse(mbMetadataHeader);

    const { evmAddress } = mbMetadata || {};

    console.log("EVM Address from mb-metadata:", evmAddress);

    if (!evmAddress) {
      return NextResponse.json(
        { error: "Wallet address is required. Make sure wallet is connected" },
        { status: 400 }
      );
    }

    // Use the accountId as the address for Mezo testnet
    // In a real implementation, you might need to derive or map this address
    const mezoAddress = evmAddress;

    // Fetch both BTC and MUSD balances concurrently
    const [btcBalance, musdBalance] = await Promise.all([
      getBTCBalance(mezoAddress),
      getMUSDBalance(mezoAddress),
    ]);

    const response: BalanceResponse = {
      btcBalance,
      musdBalance,
      address: mezoAddress,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error in get-balances API:", error);
    return NextResponse.json(
      { error: "Failed to get balances" },
      { status: 500 }
    );
  }
}

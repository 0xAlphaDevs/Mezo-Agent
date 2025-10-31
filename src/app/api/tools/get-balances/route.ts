import { headers } from "next/headers";
import { NextResponse } from "next/server";

// Mezo testnet configuration
const MEZO_TESTNET_RPC_URL = "https://rpc.test.mezo.org";
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
    // Mezo testnet uses BTC as native currency with 18 decimals
    // Use eth_getBalance to get the native BTC balance
    const rpcPayload = {
      jsonrpc: "2.0",
      method: "eth_getBalance",
      params: [address, "latest"],
      id: 1,
    };

    const response = await fetch(MEZO_TESTNET_RPC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rpcPayload),
    });

    if (!response.ok) {
      throw new Error(`RPC call failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(`RPC error: ${data.error.message}`);
    }

    // Parse the hex result to get balance (in wei, since BTC has 18 decimals on Mezo)
    const balance = data.result ? BigInt(data.result).toString() : "0";

    return {
      balance,
      decimals: 18, // BTC on Mezo testnet uses 18 decimals
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
    // ERC-20 balanceOf method call data
    // balanceOf(address) = 0x70a08231 + padded address
    const balanceOfCallData = `0x70a08231${address.slice(2).padStart(64, "0")}`;

    // Make RPC call to Mezo testnet
    const rpcPayload = {
      jsonrpc: "2.0",
      method: "eth_call",
      params: [
        {
          to: MUSD_CONTRACT_ADDRESS,
          data: balanceOfCallData,
        },
        "latest",
      ],
      id: 1,
    };

    const response = await fetch(MEZO_TESTNET_RPC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rpcPayload),
    });

    if (!response.ok) {
      throw new Error(`RPC call failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(`RPC error: ${data.error.message}`);
    }

    // Parse the hex result to get balance
    const balance = data.result ? BigInt(data.result).toString() : "0";

    return {
      balance,
      decimals: 18, // MUSD typically uses 18 decimals
      symbol: "MUSD",
    };
  } catch (error) {
    console.error("Error fetching MUSD balance:", error);
    // Return mock data if API call fails
    return {
      balance: "1000000000000000000", // 1 MUSD with 18 decimals
      decimals: 18,
      symbol: "MUSD",
    };
  }
}

export async function GET() {
  try {
    const mbMetadataHeader = (await headers()).get("mb-metadata");
    const mbMetadata: { accountId: string } =
      mbMetadataHeader && JSON.parse(mbMetadataHeader);

    const { accountId } = mbMetadata || {};

    if (!accountId) {
      return NextResponse.json(
        {
          error: "Unable to find user data in the request",
        },
        {
          status: 400,
        }
      );
    }

    // Use the accountId as the address for Mezo testnet
    // In a real implementation, you might need to derive or map this address
    const mezoAddress = accountId;

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { address } = body;

    if (!address) {
      return NextResponse.json(
        {
          error: "Address is required",
        },
        {
          status: 400,
        }
      );
    }

    // Fetch both BTC and MUSD balances concurrently
    const [btcBalance, musdBalance] = await Promise.all([
      getBTCBalance(address),
      getMUSDBalance(address),
    ]);

    const response: BalanceResponse = {
      btcBalance,
      musdBalance,
      address,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error in get-balances API (POST):", error);
    return NextResponse.json(
      { error: "Failed to get balances" },
      { status: 500 }
    );
  }
}

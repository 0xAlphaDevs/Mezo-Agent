import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { parseUnits } from "ethers";

// Mezo testnet configuration
const CHAIN_ID = 31611;

export async function GET(request: Request) {
  try {
    const mbMetadataHeader = (await headers()).get("mb-metadata");
    const mbMetadata: { evmAddress: string } =
      mbMetadataHeader && JSON.parse(mbMetadataHeader);

    const { searchParams } = new URL(request.url);
    const recepient = searchParams.get("recepient");
    const amount = searchParams.get("amount");

    const { evmAddress } = mbMetadata || {};

    console.log("EVM Address from mb-metadata:", evmAddress);
    console.log("Transfer params - Recipient:", recepient, "Amount:", amount);

    if (!evmAddress) {
      return NextResponse.json(
        { error: "Wallet address is required. Make sure wallet is connected" },
        { status: 400 }
      );
    }

    if (!recepient || !amount) {
      return NextResponse.json(
        { error: "Recipient address and amount are required" },
        { status: 400 }
      );
    }

    // Parse the amount (BTC has 18 decimals on Mezo testnet)
    const amountInWei = parseUnits(amount, 18);

    // For native BTC transfers, we don't need contract interaction
    // Just send the value directly to the recipient address
    const response = {
      txnData: "0x", // Empty data for native transfers
      chainId: CHAIN_ID,
      to: recepient,
      from: evmAddress,
      value: amountInWei.toString(),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error in transfer-btc API:", error);
    return NextResponse.json(
      { error: "Failed to create BTC transfer transaction" },
      { status: 500 }
    );
  }
}

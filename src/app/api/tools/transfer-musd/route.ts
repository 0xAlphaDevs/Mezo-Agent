import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { JsonRpcProvider, Contract, parseUnits } from "ethers";

// Mezo testnet configuration
const RPC_URL = "https://rpc.test.mezo.org";
const NETWORK_NAME = "mezo-testnet";
const CHAIN_ID = 31611;
const MUSD_CONTRACT_ADDRESS = "0x118917a40FAF1CD7a13dB0Ef56C86De7973Ac503";

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

    // Create a JSON-RPC provider for Mezo testnet
    const provider = new JsonRpcProvider(RPC_URL, {
      name: NETWORK_NAME,
      chainId: CHAIN_ID,
    });

    // ERC-20 ABI for transfer function
    const erc20Abi = [
      "function transfer(address to, uint256 amount) returns (bool)",
    ];

    // Create contract instance
    const contract = new Contract(MUSD_CONTRACT_ADDRESS, erc20Abi, provider);

    // Parse the amount (assuming it's in MUSD with 18 decimals)
    const amountInWei = parseUnits(amount, 18);

    // Encode the transfer function call data
    const txnData = contract.interface.encodeFunctionData("transfer", [
      recepient,
      amountInWei,
    ]);

    console.log("Encoded transaction data:", txnData);

    const response = {
      txnData,
      chainId: CHAIN_ID,
      to: MUSD_CONTRACT_ADDRESS,
      from: evmAddress,
      value: "0",
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error in transfer-musd API:", error);
    return NextResponse.json(
      { error: "Failed to create MUSD transfer transaction" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";

interface TokenData {
  assetId: string;
  decimals: number;
  blockchain: string;
  symbol: string;
  price: string;
  priceUpdatedAt: string;
  contractAddress?: string;
}

interface CheckTokenResponse {
  assetAvailableForSwap: boolean;
  OnBlockchain: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const assetName = searchParams.get("assetName");

    if (!assetName || typeof assetName !== "string") {
      return NextResponse.json(
        { error: "Asset name is required and must be a string" },
        { status: 400 }
      );
    }

    const response = await fetch("https://1click.chaindefuser.com/v0/tokens");

    if (!response.ok) {
      throw new Error(`1Click API responded with status: ${response.status}`);
    }

    const tokens: TokenData[] = await response.json();

    const foundToken = tokens.find(
      (token) =>
        token.symbol.toLowerCase() === assetName.toLowerCase() ||
        token.assetId.toLowerCase().includes(assetName.toLowerCase())
    );

    const result: CheckTokenResponse = {
      assetAvailableForSwap: !!foundToken,
      OnBlockchain: foundToken?.blockchain || "Near",
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error checking supported token:", error);
    return NextResponse.json(
      { error: "Failed to check token availability" },
      { status: 500 }
    );
  }
}

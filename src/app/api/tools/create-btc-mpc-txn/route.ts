import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { contracts, chainAdapters } from "signet.js";

const CONTRACT = new contracts.near.ChainSignatureContract({
  networkId: "mainnet",
  contractId: "v1.signer",
});

const btcRpcAdapter = new chainAdapters.btc.BTCRpcAdapters.Mempool(
  "https://mempool.space/api"
);

const bitcoin = new chainAdapters.btc.Bitcoin({
  network: "mainnet",
  contract: CONTRACT,
  btcRpcAdapter,
});

export async function GET(request: Request) {
  try {
    const mbMetadataHeader = (await headers()).get("mb-metadata");
    const mbMetadata: { accountId: string } =
      mbMetadataHeader && JSON.parse(mbMetadataHeader);
    const { accountId } = mbMetadata || {};

    const { searchParams } = new URL(request.url);
    // const accountId = searchParams.get("accountId");
    const btcReceiverAddress = searchParams.get("btcReceiver");
    const btcAmountInSatoshi = searchParams.get("btcAmountInSatoshi");

    if (!btcReceiverAddress || !btcAmountInSatoshi) {
      return NextResponse.json(
        {
          error:
            "btcReceiverAddress and btcAmountInSatoshi are required parameters",
        },
        { status: 400 }
      );
    }

    // get sender btc address
    const { address: btcSenderAddress, publicKey: btcSenderPublicKey } =
      await bitcoin.deriveAddressAndPublicKey(accountId as string, "bitcoin-1");

    // create MPC payload and txn
    const { transaction, hashesToSign } =
      await bitcoin.prepareTransactionForSigning({
        publicKey: btcSenderPublicKey,
        from: btcSenderAddress,
        to: btcReceiverAddress,
        value: btcAmountInSatoshi.toString(),
      });

    const mpcTransactions = {
      signerId: accountId as string,
      receiverId: "v1.signer",
      actions: [
        {
          type: "FunctionCall",
          params: {
            methodName: "sign",
            args: {
              request: {
                payload: Array.from(hashesToSign[0]),
                path: "bitcoin-1",
                key_version: 0,
              },
            },
            gas: "250000000000000",
            deposit: "1",
          },
        },
      ],
    };

    return NextResponse.json(mpcTransactions);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate NEAR MPC transaction payload" },
      { status: 500 }
    );
  }
}

import { ParsedTransaction, Transaction } from "./types";

export function parseBitcoinTransaction(
  txns: Transaction[],
  btcAddress: string
): ParsedTransaction[] {
  const SATS_IN_BTC = 100_000_000;
  return txns
    .map((tx) => {
      const isSender = tx.vin.some(
        (vin) => vin.prevout?.scriptpubkey_address == btcAddress
      );
      const isReceiver = tx.vout.some(
        (vout) => vout.scriptpubkey_address == btcAddress
      );

      let amount = 0;
      let type: "sent" | "received";

      if (isSender) {
        // Amount sent = sum of all outputs NOT to this address
        // Optional improvement: to show actual amount sent to another party,
        // rather than change returning to self.
        const sentTotal = tx.vout
          .filter((vout) => vout.scriptpubkey_address !== btcAddress)
          .reduce((sum, vout) => sum + vout.value, 0);

        amount = sentTotal / SATS_IN_BTC;
        type = "sent";
      } else if (isReceiver) {
        const receivedTotal = tx.vout
          .filter((vout) => vout.scriptpubkey_address === btcAddress)
          .reduce((sum, vout) => sum + vout.value, 0);

        amount = receivedTotal / SATS_IN_BTC;
        type = "received";
      } else {
        // This tx is not relevant to the address
        return null;
      }

      return {
        hash: tx.txid,
        from: tx.vin[0]?.prevout?.scriptpubkey_address || "", // First input addr
        to: tx.vout[0]?.scriptpubkey_address || "", // First output addr
        amount,
        fee: tx.fee / SATS_IN_BTC,
        type,
        timestamp: new Date(tx.status.block_time * 1000),
      };
    })
    .filter(Boolean) as ParsedTransaction[];
}

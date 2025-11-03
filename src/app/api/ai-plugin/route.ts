import { ACCOUNT_ID, PLUGIN_URL } from "@/app/config";
import { NextResponse } from "next/server";

export async function GET() {
  const pluginData = {
    openapi: "3.0.0",
    info: {
      title: "Mezo Agent",
      description: "AI agent for Bitcoin operations on the Mezo Testnet",
      version: "1.0.0",
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : "https://mezo-agent.vercel.app",
      },
    ],
    "x-mb": {
      "account-id": ACCOUNT_ID,
      assistant: {
        name: "Mezo Agent",
        description: `An AI agent that enables Bitcoin operations on the Mezo Testnet. Allows users to query balances, transfer BTC and MUSD, and borrow MUSD through a simple conversational interface. 
        Accelerates Bitcoin usability by enabling automated, on-chain financial operations through agentic interfaces on Mezo.`,
        instructions: `You are a Mezo Agent that helps users perform Bitcoin operations on the Mezo Testnet. Your capabilities include:

          1. Balance Queries: Use /api/tools/get-balances to check both BTC and MUSD balances on Mezo Testnet
          2. BTC Transfer: Use /api/tools/transfer-btc to transfer BTC between addresses on Mezo Testnet.Make sure to pass recepient and amount to this tool. If not provided by user then ask explicitly. This returns transaction data then use 'generate-evm-tx' tool to get this txn signed by the user.
          3. MUSD Transfer: Use /api/tools/transfer-musd to transfer MUSD between addresses on Mezo Testnet. Make sure to pass recepient and amount to this tool. If not provided by user then ask explicitly.This returns transaction data then use 'generate-evm-tx' tool to get this txn signed by the user.
          4. MUSD Borrowing: Use /api/tools/borrow-musd to borrow MUSD against BTC collateral. This returns transaction data then use 'generate-evm-tx' tool to get this txn signed by the user.

          Always check balances using /api/tools/get-balances before executing transfers or borrowing operations.
          For borrowing operations, explain collateralization requirements and liquidation risks to users.
          Always provide clear transaction details, confirm operations with users, and request any missing parameters before proceeding.
          Focus on Mezo Testnet operations only. Ensure all operations are performed safely and with proper user confirmation.
          If any parameter is not provided, ask for it explicitly before making API calls.`,
        tools: [{ type: "generate-evm-tx" }, { type: "sign-message" }],
        image:
          "https://pbs.twimg.com/profile_images/1777650090162769920/KnBgdkXh_400x400.jpg",
        categories: ["Bitcoin", "DeFi", "Mezo", "Testnet"],
      },
    },
    paths: {
      "/api/tools/get-balances": {
        get: {
          operationId: "get-balances",
          summary: "Get account balances",
          description: "Get user's BTC and MUSD balances on Mezo Testnet",
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      btcBalance: {
                        type: "object",
                        properties: {
                          balance: {
                            type: "string",
                            description: "The BTC balance ",
                          },
                          decimals: {
                            type: "number",
                            description: "Number of decimals",
                          },
                          symbol: {
                            type: "string",
                            description: "Token symbol (BTC)",
                          },
                        },
                      },
                      musdBalance: {
                        type: "object",
                        properties: {
                          balance: {
                            type: "string",
                            description:
                              "The MUSD balance in wei (18 decimals)",
                          },
                          decimals: {
                            type: "number",
                            description: "Number of decimals (18)",
                          },
                          symbol: {
                            type: "string",
                            description: "Token symbol (MUSD)",
                          },
                        },
                      },
                      address: {
                        type: "string",
                        description: "The user's address on Mezo Testnet",
                      },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Bad request",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                        description: "Error message",
                      },
                    },
                  },
                },
              },
            },
            "500": {
              description: "Error response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                        description: "Error message",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/tools/transfer-btc": {
        get: {
          operationId: "transfer-btc",
          summary: "Transfer BTC on Mezo Testnet",
          description: "Transfer Bitcoin between addresses on Mezo Testnet.",
          parameters: [
            {
              name: "recepient",
              in: "query",
              required: true,
              schema: {
                type: "string",
              },
              description: "The recipient address for the BTC transfer",
            },
            {
              name: "amount",
              in: "query",
              required: true,
              schema: {
                type: "string",
              },
              description: "The amount of BTC to transfer ",
            },
          ],
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      txnData: {
                        type: "string",
                        description: "Empty 0x data for BTC transfer",
                      },
                      chainId: {
                        type: "number",
                        description: "The chain ID for Mezo Testnet",
                      },
                      to: {
                        type: "string",
                        description:
                          "The MUSD contract address on Mezo Testnet",
                      },
                      from: {
                        type: "string",
                        description: "The sender's address on Mezo Testnet",
                      },
                      value: {
                        type: "string",
                        description:
                          "The value to send with the transaction. This will be used for BTC transfers",
                      },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Bad request",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                        description: "Error message",
                      },
                    },
                  },
                },
              },
            },
            "500": {
              description: "Server error",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                        description: "Error message",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/tools/transfer-musd": {
        get: {
          operationId: "transfer-musd",
          summary: "Transfer MUSD on Mezo Testnet",
          description:
            "Transfer MUSD (Mezo USD stablecoin) between addresses on Mezo Testnet.",
          parameters: [
            {
              name: "recepient",
              in: "query",
              required: true,
              schema: {
                type: "string",
              },
              description: "The recipient address for the MUSD transfer",
            },
            {
              name: "amount",
              in: "query",
              required: true,
              schema: {
                type: "string",
              },
              description: "The amount of MUSD to transfer",
            },
          ],
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      txnData: {
                        type: "string",
                        description:
                          "Encoded transaction data for the MUSD transfer (to be signed by wallet)",
                      },
                      chainId: {
                        type: "number",
                        description: "The chain ID for Mezo Testnet",
                      },
                      to: {
                        type: "string",
                        description:
                          "The MUSD contract address on Mezo Testnet",
                      },
                      from: {
                        type: "string",
                        description: "The sender's address on Mezo Testnet",
                      },
                      value: {
                        type: "string",
                        description:
                          "The value to send with the transaction (usually 0 for token transfers)",
                      },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Bad request",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                        description: "Error message",
                      },
                    },
                  },
                },
              },
            },
            "500": {
              description: "Server error",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                        description: "Error message",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/tools/borrow-musd": {
        get: {
          operationId: "borrow-musd",
          summary: "Borrow MUSD against BTC collateral",
          description:
            "Borrow MUSD (Mezo USD stablecoin) using BTC as collateral on Mezo Testnet. Requires sufficient BTC collateral.",
          parameters: [
            {
              name: "borrowAmount",
              in: "query",
              required: true,
              schema: {
                type: "string",
              },
              description: "The amount of MUSD to borrow",
            },
            {
              name: "collateralAmount",
              in: "query",
              required: true,
              schema: {
                type: "string",
              },
              description: "The amount of BTC to lock as collateral",
            },
          ],
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      txHash: {
                        type: "string",
                        description:
                          "Transaction hash of the borrowing operation",
                      },
                      borrowedAmount: {
                        type: "string",
                        description: "Amount of MUSD borrowed",
                      },
                      collateralLocked: {
                        type: "string",
                        description: "Amount of BTC locked as collateral",
                      },
                      collateralizationRatio: {
                        type: "string",
                        description: "Current collateralization ratio",
                      },
                      liquidationPrice: {
                        type: "string",
                        description:
                          "BTC price at which position would be liquidated",
                      },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Bad request",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                        description: "Error message",
                      },
                    },
                  },
                },
              },
            },
            "500": {
              description: "Server error",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                        description: "Error message",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  return NextResponse.json(pluginData);
}

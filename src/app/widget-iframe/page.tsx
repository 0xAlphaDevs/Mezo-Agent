"use client";

import { useContext } from "react";
import { BitteWidgetChat } from "@bitte-ai/chat";
import "@bitte-ai/chat/styles.css";
import { useAppKitAccount } from "@reown/appkit/react";
import { useSendTransaction, useSwitchChain } from "wagmi";

export default function WidgetIframePage() {
  const { address } = useAppKitAccount();
  const { data: hash, sendTransaction } = useSendTransaction();
  const { switchChain } = useSwitchChain();

  return (
    <div style={{ background: "transparent" }}>
      <BitteWidgetChat
        options={{
          agentImage: "/icon.svg",
          agentName: "Bitcoin Assistant",
        }}
        agentId="bitcoin-agent.xyz"
        apiUrl="/api/chat"
        wallet={{
          evm: { address, hash, sendTransaction, switchChain },
        }}
        widget={{
          widgetWelcomePrompts: {
            questions: ["Get my BTC balance?"],
            actions: ["Get Balance"],
          },
          customTriggerButton: (
            <button
              style={{
                width: 56,
                height: 56,
                border: "3px solid #34d399",
                boxShadow:
                  "0 0 24px 8px rgba(16,185,129,0.5), 0 0 0 0 rgba(16,185,129,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                position: "relative",
                animation: "glow-pop 1.5s infinite alternate",
                transition: "transform 0.2s cubic-bezier(.4,2,.6,1)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.08)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
              aria-label="Open Chat Widget"
            >
              <img src="/icon.svg" alt="Chat Icon" />
              <style>{`
                @keyframes glow-pop {
                  0% {
                    box-shadow: 0 0 24px 8px rgba(16,185,129,0.5), 0 0 0 0 rgba(16,185,129,0.3);
                  }
                  100% {
                    box-shadow: 0 0 32px 16px rgba(16,185,129,0.7), 0 0 0 8px rgba(16,185,129,0.15);
                  }
                }
              `}</style>
            </button>
          ),
        }}
      />
    </div>
  );
}

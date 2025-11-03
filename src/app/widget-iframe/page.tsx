"use client";

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
          agentImage: "assets/mezo.svg",
          agentName: "Mezo Assistant",
        }}
        agentId="bitcoin-agent.xyz"
        apiUrl="/api/chat"
        wallet={{
          evm: {
            address,
            hash,
            sendTransaction: sendTransaction as any,
            switchChain: switchChain as any,
          },
        }}
        widget={{
          widgetWelcomePrompts: {
            questions: ["What is my MUSD balance?"],
            actions: ["Get Balances"],
          },
          customTriggerButton: (
            <div style={{ background: "transparent", padding: 0, margin: 0 }}>
              <button
                style={{
                  width: 56,
                  height: 56,
                  border: "3px solid #FF004D",
                  borderRadius: "50%",
                  backgroundColor: "white",
                  boxShadow:
                    "0 0 24px 8px rgba(255,0,77,0.5), 0 0 0 0 rgba(255,0,77,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  position: "relative",
                  animation: "glow-pop 1.5s infinite alternate",
                  transition: "transform 0.2s cubic-bezier(.4,2,.6,1)",
                  outline: "none",
                  padding: 0,
                  margin: 0,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.08)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
                aria-label="Open Chat Widget"
              >
                <img
                  src="assets/mezo.svg"
                  alt="Chat Icon"
                  style={{ width: "32px", height: "32px" }}
                />
                <style>{`
                @keyframes glow-pop {
                  0% {
                    box-shadow: 0 0 24px 8px rgba(255,0,77,0.5), 0 0 0 0 rgba(255,0,77,0.3);
                  }
                  100% {
                    box-shadow: 0 0 32px 16px rgba(255,0,77,0.7), 0 0 0 8px rgba(255,0,77,0.15);
                  }
                }
                
                /* Override Bitte widget library specific styles */
                .bitte-fixed.bitte-bottom-16.bitte-right-8.bitte-z-\\[99999\\].bitte-h-14.bitte-w-14.bitte-cursor-pointer.bitte-rounded-lg.bitte-p-2.bitte-shadow-md,
                .bitte-fixed.bitte-bottom-16.bitte-right-8,
                .bitte-h-14.bitte-w-14.bitte-cursor-pointer.bitte-rounded-lg.bitte-p-2.bitte-shadow-md,
                .bitte-rounded-lg.bitte-p-2.bitte-shadow-md,
                .bitte-p-2,
                .bitte-rounded-lg,
                .bitte-shadow-md,
                [class*="bitte-"],
                [class*="bitte-fixed"],
                [class*="bitte-rounded"],
                [class*="bitte-p-"],
                [class*="bitte-shadow"] {
                  background: transparent !important;
                  background-color: transparent !important;
                  border-radius: 50% !important;
                  padding: 0 !important;
                  margin: 0 !important;
                  box-shadow: none !important;
                  border: none !important;
                }

                /* Override any default widget container styling */
                .bitte-widget-trigger,
                .bitte-widget-trigger-container,
                [data-bitte-widget-trigger],
                [data-bitte-widget-trigger] > *,
                .bitte-chat-widget-trigger,
                .bitte-widget-button,
                .bitte-chat-button,
                .widget-trigger,
                .chat-trigger,
                .chat-widget-trigger,
                .widget-button,
                div[class*="trigger"],
                div[class*="widget"],
                div[class*="chat"],
                button[class*="trigger"],
                button[class*="widget"] {
                  background: transparent !important;
                  background-color: transparent !important;
                  border-radius: 50% !important;
                  padding: 0 !important;
                  margin: 0 !important;
                  box-shadow: none !important;
                  border: none !important;
                }

                /* Target parent containers and pseudo elements */
                .bitte-widget-trigger::before,
                .bitte-widget-trigger::after,
                [data-bitte-widget-trigger]::before,
                [data-bitte-widget-trigger]::after,
                [class*="bitte-"]::before,
                [class*="bitte-"]::after {
                  display: none !important;
                }
              `}</style>
              </button>
            </div>
          ),
        }}
      />
    </div>
  );
}

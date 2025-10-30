import { NearProvider } from "@/context/NearProvider";

export default function WidgetIframeLayout({ children }: { children: React.ReactNode }) {
  return <NearProvider>{children}</NearProvider>;
}
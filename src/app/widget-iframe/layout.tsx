import MezoProvider from "@/context/MezoProvider";

export default function WidgetIframeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MezoProvider>{children}</MezoProvider>;
}

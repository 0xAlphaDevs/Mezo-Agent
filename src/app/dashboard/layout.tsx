import MezoProvider from "@/context/MezoProvider";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <MezoProvider>{children}</MezoProvider>;
}

import React from "react";
import { MezoProviders } from "@/context/MezoProvider";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (<MezoProviders>{children}</MezoProviders>);
}

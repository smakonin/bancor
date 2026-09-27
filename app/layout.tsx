import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bancor World — Global Trade Clearing Simulator",
  description: "Explore a gold-anchored Bancor system and test how symmetric trade adjustment could rebalance the world economy.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}

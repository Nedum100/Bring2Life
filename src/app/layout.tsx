import type { Metadata } from "next";
import "./globals.css";
import { WalletProvider } from "@/contexts/WalletContext";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Bring2Life - Web3 Art Commissions",
  description: "Commission custom art with blockchain trust. Powered by Hedera.",
  keywords: ["art commission", "NFT", "blockchain", "Hedera", "Web3"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>
          <Navbar />
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}

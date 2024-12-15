import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { Toaster } from "@/components/ui/toaster";
import { ToasterS } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Cafe",
  description: "Cafe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <Toaster />
        <ToasterS />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

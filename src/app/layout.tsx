import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "TheChattala - চট্টলার হাইপারলোকাল প্ল্যাটফর্ম",
  description: "Hyperlocal platform for Chittagong - Marketplace, Community Hub, and more",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}

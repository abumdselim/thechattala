import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Chattala - Hyperlocal Platform for Chattogram",
  description: "A complete hyperlocal platform for Chattogram combining community hub with digital marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Chattala - Hyperlocal Community Platform",
  description: "A hyperlocal community platform connecting local businesses, services, and residents",
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
      </body>
    </html>
  );
}

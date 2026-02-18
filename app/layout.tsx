import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Chattala",
  description: "A hyperlocal community platform for Chattala",
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

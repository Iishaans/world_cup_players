import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";

export const metadata: Metadata = {
  title: "World Cup 5s — Historical Draft Game",
  description:
    "Draft five World Cup legends by nation and decade, build the perfect five-a-side team, and try to go 7-0 and lift the trophy.",
};

export const viewport: Viewport = {
  themeColor: "#070a12",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <SiteHeader />
        <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-6">{children}</main>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "World Cup 5s — Historical Draft Game",
    template: "%s · World Cup 5s",
  },
  description:
    "Draft five World Cup legends by nation and decade, build the perfect five-a-side team, and simulate a seven-match tournament to lift the trophy.",
  keywords: [
    "World Cup",
    "football",
    "soccer",
    "draft game",
    "daily game",
    "5-a-side",
    "legends",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "World Cup 5s",
    title: "World Cup 5s — Historical Draft Game",
    description:
      "Draft five World Cup legends, assign roles, and simulate a seven-match tournament. Can you go 7-0?",
    images: [
      {
        url: "/og.svg",
        width: 1200,
        height: 630,
        alt: "World Cup 5s — Historical Draft Game",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "World Cup 5s — Historical Draft Game",
    description:
      "Draft five World Cup legends, assign roles, and simulate a seven-match tournament.",
    images: ["/og.svg"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
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

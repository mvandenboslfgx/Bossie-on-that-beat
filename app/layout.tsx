import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./live-catalog.css";
import "./multipage.css";
import "./request.css";

export const metadata: Metadata = {
  title: {
    default: "Bossie on the beat — Every Track Is A New World",
    template: "%s — Bossie on the beat",
  },
  description:
    "The official world of Bossie on the beat. Cinematic music, dark orchestral worlds, global anthems, club energy and visual storytelling without genre boundaries.",
  keywords: [
    "Bossie on the beat",
    "Bossie on that beat",
    "independent artist",
    "cinematic music",
    "metal",
    "EDM",
    "global music",
    "music producer",
  ],
  creator: "Bossie on the beat",
  publisher: "Bossie on the beat",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Bossie on the beat",
    title: "Bossie on the beat — Every Track Is A New World",
    description:
      "Enter a multi-genre universe where every release becomes its own cinematic world.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bossie on the beat — Every Track Is A New World",
    description: "Music without boundaries. Every track is a new world.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050505",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

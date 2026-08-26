import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./live-catalog.css";
import "./multipage.css";
import "./request.css";
import "./v2.css";
import "./bossie-v3.css";
import "./bossie-mobile.css";
import { getBrandAssetUrl } from "@/lib/brand/assets";
import { getSameAsUrls } from "@/lib/brand/socials";
import { siteSettings } from "@/lib/site-settings";

const siteUrl = siteSettings.siteUrl;
const ogImage = getBrandAssetUrl("socialShare", siteUrl);

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Bossie on the beat | Producer, Composer & Artist",
    template: "%s | Bossie on the beat",
  },
  description:
    "Official website of Bossie on the beat, an independent producer, composer and artist creating cinematic, orchestral, metal, electronic, rap and global music. Every track is a new world.",
  keywords: [
    "Bossie on the beat",
    "Bossie on that beat",
    "Bossie producer",
    "Bossie music producer",
    "Bossie artist",
    "Bossie music",
    "cinematic music producer",
    "orchestral metal producer",
    "independent music producer",
    "music composer",
    "EDM producer",
    "CROWN OF THE ABYSS",
    "One World One Dream",
    "Symphony Of The Storm",
    "Nul Een Acht Zes",
    "Gasolina",
  ],
  creator: "Bossie on the beat",
  publisher: "Bossie on the beat",
  applicationName: "Bossie on the beat",
  category: "music",
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
    title: "Bossie on the beat | Producer, Composer & Artist",
    description:
      "Official Bossie on the beat website. Music without genre boundaries — every track is a new world.",
    ...(ogImage ? { images: [{ url: ogImage, alt: "Bossie on the beat official logo" }] } : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: "Bossie on the beat | Producer, Composer & Artist",
    description: "Official website. Music without boundaries. Every track is a new world.",
    ...(ogImage ? { images: [ogImage] } : {}),
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050505",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const artistSchema = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    "@id": `${siteUrl}/#artist`,
    name: siteSettings.artistName,
    alternateName: siteSettings.artistAltName,
    url: siteUrl,
    description:
      "Independent producer, composer and artist creating cinematic, orchestral, metal, electronic, rap and global music.",
    genre: ["Cinematic", "Orchestral", "Metal", "Electronic", "Rap", "Global Music"],
    sameAs: getSameAsUrls(),
    ...(ogImage ? { logo: ogImage, image: ogImage } : {}),
  };

  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(artistSchema) }} />
        {children}
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import "./live-catalog.css";
import "./multipage.css";
import "./request.css";
import "./v2.css";
import "./bossie-v3.css";
import "./bossie-mobile.css";
import "./luxury.css";
import "./performance-fixes.css";
import { getBrandAssetUrl } from "@/lib/brand/assets";
import { getSameAsUrls } from "@/lib/brand/socials";
import { siteSettings } from "@/lib/site-settings";
import { serializeJsonLd } from "@/lib/seo/json-ld";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const sansFont = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const siteUrl = siteSettings.siteUrl;
const ogImage = getBrandAssetUrl("socialShare", siteUrl);

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Bossie on that beat | Producer, Composer & Artist",
    template: "%s | Bossie on that beat",
  },
  description:
    "Official website of Bossie on that beat, an independent producer, composer and artist creating cinematic, orchestral, metal, electronic, rap and global music. Every track is a new world.",
  keywords: [
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
  creator: "Bossie on that beat",
  publisher: "Bossie on that beat",
  applicationName: "Bossie on that beat",
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
    siteName: "Bossie on that beat",
    title: "Bossie on that beat | Producer, Composer & Artist",
    description:
      "Official Bossie on that beat website. Music without genre boundaries — every track is a new world.",
    ...(ogImage ? { images: [{ url: ogImage, alt: "Bossie on that beat official logo" }] } : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: "Bossie on that beat | Producer, Composer & Artist",
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
  const siteSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: siteSettings.artistName,
        description: siteSettings.defaultSeo.description,
        inLanguage: "en",
        publisher: { "@id": `${siteUrl}/#artist` },
      },
      {
        "@type": "MusicGroup",
        "@id": `${siteUrl}/#artist`,
        name: siteSettings.artistName,
        url: siteUrl,
        description:
          "Independent producer, composer and artist creating cinematic, orchestral, metal, electronic, rap and global music as complete worlds of sound, image and story.",
        genre: ["Cinematic", "Orchestral", "Metal", "Electronic", "Rap", "Global Music"],
        sameAs: getSameAsUrls(),
        mainEntityOfPage: { "@id": `${siteUrl}/#website` },
        ...(ogImage ? { logo: ogImage, image: ogImage } : {}),
      },
    ],
  };

  return (
    <html lang="en" className={`${displayFont.variable} ${sansFont.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(siteSchema) }} />
        {children}
      </body>
    </html>
  );
}

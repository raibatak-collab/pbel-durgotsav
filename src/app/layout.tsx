import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Rozha_One } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const rozhaOne = Rozha_One({
  weight: "400",
  variable: "--font-heading",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#850E1F",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.pbelcitydurgotsav.com"),
  title: {
    default: "PBEL City Durgotsav 2026 | PBEL Sanskritik Samiti",
    template: "%s | PBEL City Durgotsav 2026",
  },
  description:
    "Join PBEL City Durgotsav 2026 from 15th to 20th Oct in Hyderabad. Pujo Nirghanto, Maha Bhog, Pratibimb cultural acts, Anandamela food fiesta & devotee seva offerings.",
  keywords: [
    "PBEL City",
    "Durga Pujo",
    "Durgotsav 2026",
    "Hyderabad Durga Puja",
    "PBEL Sanskritik Samiti",
    "PSS",
    "Pratibimb",
    "Anandamela",
    "Peerancheru",
  ],
  authors: [{ name: "PBEL Sanskritik Samiti" }],
  creator: "PBEL Sanskritik Samiti",
  publisher: "PBEL Sanskritik Samiti",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.pbelcitydurgotsav.com",
    siteName: "PBEL City Durgotsav 2026",
    title: "PBEL City Durgotsav 2026 | PBEL Sanskritik Samiti",
    description:
      "Celebrate Durga Pujo with PBEL Sanskritik Samiti (15-20 Oct 2026). Explore ritual schedule, offer seva, register cultural acts & join Hyderabad's grand community festival.",
    images: [
      {
        url: "/og-image.png",
        secureUrl: "https://www.pbelcitydurgotsav.com/og-image.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "PBEL City Durgotsav 2026 - Maa Durga Sacred Emblem & Festival Banner",
      },
      {
        url: "/pbel-durgotsav-icon.png",
        secureUrl: "https://www.pbelcitydurgotsav.com/pbel-durgotsav-icon.png",
        width: 512,
        height: 512,
        type: "image/png",
        alt: "PBEL City Durgotsav Official Sacred Icon",
      },
      {
        url: "/whatsapp-thumb.png",
        secureUrl: "https://www.pbelcitydurgotsav.com/whatsapp-thumb.png",
        width: 300,
        height: 300,
        type: "image/png",
        alt: "PBEL City Durgotsav WhatsApp Preview Thumbnail",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PBEL City Durgotsav 2026 | PBEL Sanskritik Samiti",
    description:
      "Join the 6-day grand celebration of devotion, heritage, cultural stage acts, and community unity in Hyderabad (15 - 20 Oct 2026).",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/pbel-durgotsav-icon.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon.png", sizes: "64x64", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/apple-icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/pbel-durgotsav-icon.png",
  },
  other: {
    "image_src": "https://www.pbelcitydurgotsav.com/pbel-durgotsav-icon.png",
    "og:image:secure_url": "https://www.pbelcitydurgotsav.com/og-image.png",
    "og:image:type": "image/png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${rozhaOne.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground pb-20 md:pb-0">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}

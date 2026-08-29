import type { Metadata } from "next";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://pbeldurgotsav.in"),
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
    url: "https://pbeldurgotsav.in",
    siteName: "PBEL City Durgotsav 2026",
    title: "PBEL City Durgotsav 2026 | PBEL Sanskritik Samiti",
    description:
      "Celebrate Durga Pujo with PBEL City Sanskritik Samiti (15-20 Oct 2026). Explore schedule, offer seva, register cultural acts & join community celebrations in Hyderabad.",
    images: [
      {
        url: "/images/wallpapers/durga_ekchala.svg",
        width: 1200,
        height: 630,
        alt: "PBEL City Durgotsav 2026 - Maa Durga",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PBEL City Durgotsav 2026 | PBEL Sanskritik Samiti",
    description:
      "Join the 6-day grand celebration of devotion, heritage, cultural stage acts, and community unity in Hyderabad (15 - 20 Oct 2026).",
    images: ["/images/wallpapers/durga_ekchala.svg"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
  },
  themeColor: "#850E1F",
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

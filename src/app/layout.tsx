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
  title: "PBEL City Durgotsav",
  description: "Celebrate Durga Pujo with the PBEL City Sanskritik Samiti",
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

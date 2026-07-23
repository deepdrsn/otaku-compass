import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import Header from "@/components/layout/Header";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL("https://otaku-compass.vercel.app"),
  title: {
    default: "Otaku Compass — Find Your Next Obsession",
    template: "%s | Otaku Compass",
  },
  description:
    "The anime recommendation engine that actually gets it. Search by vibe, tag, or plain English — OP MC, isekai, tearjerker romance, dark psychological thrillers, and more.",
  keywords: [
    "anime recommendation",
    "isekai anime",
    "anime tags",
    "best anime",
    "anime search engine",
  ],
  openGraph: {
    title: "Otaku Compass — Find Your Next Obsession",
    description: "Search anime by vibe, tag combos, or plain English.",
    type: "website",
  },
  icons: { icon: "/favicon.ico" },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#05040c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} dark`}>
      <body className="animated-bg min-h-screen font-sans antialiased">
        <QueryProvider>
          <Header />
          <main className="relative z-10">{children}</main>
        </QueryProvider>
      </body>
    </html>
  );
}

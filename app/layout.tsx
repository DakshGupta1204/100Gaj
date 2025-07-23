import type { Metadata, Viewport } from "next";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./providers";
import dynamic from 'next/dynamic';
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

// Dynamically import the PremiumPopup component with no SSR to avoid hydration issues
const PremiumPopup = dynamic(() => import('@/components/ui/PremiumPopup'));

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: "100 Gaj - Premium Real Estate Platform",
  description: "Housing Services for Everyone - Find your perfect property with 100 Gaj's premium real estate platform",
  icons: {
    icon: "/favicon.ico",
  },
  robots: 'index, follow',
  authors: [{ name: '100 Gaj Team' }],
  keywords: 'real estate, properties, housing, buy, sell, rent, luxury homes',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FF6600',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//res.cloudinary.com" />
        <link rel="dns-prefetch" href="//ik.imagekit.io" />
        <meta name="theme-color" content="#FF6600" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
      >
        <Toaster position="top-center" />
        <AuthProvider>
          {children}
          <PremiumPopup />
        </AuthProvider>
        
      </body>
    </html>
  );
}

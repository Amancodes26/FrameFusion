import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/Header";
import Provider from "@/Provider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from 'sonner';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FrameFusion - Generate Images for FREE",
  description:
    "Create stunning visuals effortlessly with FrameFusion. Use advanced AI models to transform your ideas into beautiful images for free!",
  openGraph: {
    title: "FrameFusion - Free AI Image Generation",
    description:
      "Effortlessly generate high-quality images from text using FrameFusion's AI-powered tool.",
    images: [
      {
        url: '/images/logo1.png',
        width: 70,
        height: 70,
        alt: 'FrameFusion Logo',
      }
    ],
  },
  icons: {
    icon: '/images/logo1.png',
    shortcut: '/images/logo1.png',
    apple: '/images/logo1.png',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark">
          <Provider>
            <Header />
            <main>
              {children}
            </main>
            <Toaster />
            <SonnerToaster richColors position="top-center" />
          </Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}

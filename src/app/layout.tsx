import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Provider from "@/Provider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from 'sonner';
import { FloatingNav } from "@/components/ui/floating-navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'https://framefusionai.vercel.app'),
  title: {
    default: "FrameFusion - Free AI Image Generator | Create Stunning Visuals",
    template: "%s | FrameFusion"
  },
  description:
    "Create stunning visuals effortlessly with FrameFusion. Use advanced AI models to transform your ideas into beautiful images for free! Generate AI art, illustrations, and photos in seconds.",
  keywords: [
    "AI image generator",
    "free AI art",
    "text to image",
    "AI art generator",
    "image generation",
    "AI photos",
    "create images with AI",
    "FrameFusion",
    "AI illustrations",
    "free image generator"
  ],
  authors: [{ name: "FrameFusion" }],
  creator: "FrameFusion",
  publisher: "FrameFusion",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "FrameFusion",
    title: "FrameFusion - Free AI Image Generator",
    description:
      "Effortlessly generate high-quality images from text using FrameFusion's AI-powered tool. Create stunning visuals in seconds.",
    images: [
      {
        url: '/images/logo1.png',
        width: 1200,
        height: 630,
        alt: 'FrameFusion - AI Image Generator',
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FrameFusion - Free AI Image Generator",
    description: "Create stunning visuals effortlessly with AI. Transform your ideas into beautiful images for free!",
    images: ['/images/logo1.png'],
    creator: "@framefusion",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/images/logo1.png',
    shortcut: '/images/logo1.png',
    apple: '/images/logo1.png',
  },
  manifest: '/manifest.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'FrameFusion',
              description: 'AI-powered image generator that transforms text into stunning visuals',
              url: process.env.NEXTAUTH_URL || 'https://framefusionai.vercel.app',
              applicationCategory: 'MultimediaApplication',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              creator: {
                '@type': 'Organization',
                name: 'FrameFusion',
              },
            }),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('framefusion-theme') === 'light' || (!localStorage.getItem('framefusion-theme') && window.matchMedia('(prefers-color-scheme: light)').matches)) {
                  document.documentElement.classList.remove('dark')
                } else {
                  document.documentElement.classList.add('dark')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative dark`}
      >
        <ThemeProvider 
          attribute="class" 
          defaultTheme="dark" 
          enableSystem={false}
          storageKey="framefusion-theme"
          disableTransitionOnChange
        >
          <Provider>
            <FloatingNav />
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

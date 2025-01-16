import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/Header";

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
        url: "/images/framefusion-preview.jpg", //replace to org url
        alt: "Preview of an AI-generated image from FrameFusion",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FrameFusion - Free AI Image Generation",
    description:
      "Effortlessly generate high-quality images from text using FrameFusion's AI-powered tool.",
    images: [
      {
        url: "/images/framefusion-twitter.jpg", //replace to org url
        alt: "Preview of an AI-generated image from FrameFusion",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"  suppressHydrationWarning >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark">
          <Header/>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

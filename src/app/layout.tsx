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
        width: 20,
        height: 20,
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
      <head>
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

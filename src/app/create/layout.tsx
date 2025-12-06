import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Create AI Images - Free Image Generator",
  description: "Generate stunning AI images for free using advanced models like Flux, SDXL, and more. Transform your text prompts into beautiful artwork in seconds.",
  openGraph: {
    title: "Create AI Images - FrameFusion Generator",
    description: "Turn your ideas into stunning visuals with our free AI image generator. Multiple AI models available.",
  },
};

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

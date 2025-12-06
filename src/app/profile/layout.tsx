import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Your Profile - FrameFusion Gallery",
  description: "View and manage your AI-generated images. Download, share, and organize your creative gallery on FrameFusion.",
  openGraph: {
    title: "My FrameFusion Profile",
    description: "Your personal gallery of AI-generated images and artwork.",
  },
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

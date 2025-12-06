import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://framefusionai.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/checkout/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

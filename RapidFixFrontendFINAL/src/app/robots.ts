import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/',
          '/checkout',
          '/checkout/',
          '/api/',
          '/_next/',
        ],
      },
    ],
    sitemap: 'https://rapidfixauto.in/sitemap.xml',
    host: 'https://rapidfixauto.in',
  };
}
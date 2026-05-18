import type { MetadataRoute } from 'next';

// Add all the cities you want to rank for
const cities = [
  'delhi', 'noida', 'gurgaon', 'faridabad', 'ghaziabad', 'greater-noida', 'dwarka'
];

const services = [
  'bike-service', 'car-service', 'bike-repair', 'car-repair',
  'puncture-repair', 'car-ac-repair', 'denting-painting',
  'ev-service', 'battery-replacement', 'tyre-wheel'
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://rapidfixauto.in';

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/actions`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/booking`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/locations`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ];

  // Dynamic [city] routes
  const cityRoutes: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${baseUrl}/mechanic-near-me-in-${city}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,   // high priority — these are your SEO money pages
  }));

  const serviceRoutes: MetadataRoute.Sitemap = services.map(s => ({
    url: `${baseUrl}/services/${s}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const bikeServiceCityRoutes: MetadataRoute.Sitemap = cities.map(city => ({
    url: `${baseUrl}/bike-service-in-${city}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const carServiceCityRoutes: MetadataRoute.Sitemap = cities.map(city => ({
    url: `${baseUrl}/car-service-in-${city}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...cityRoutes, ...serviceRoutes, ...bikeServiceCityRoutes, ...carServiceCityRoutes];
}
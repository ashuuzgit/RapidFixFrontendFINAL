import type { MetadataRoute } from 'next';

// Add all the cities you want to rank for
const cities = [
  'delhi',
  'new-delhi',
  'noida',
  'gurgaon',
  'faridabad',
  'ghaziabad',
  'greater-noida',
  'mumbai',
  'pune',
  'bangalore',
  'hyderabad',
  'chennai',
  'kolkata',
  'lucknow',
  'kanpur',
  'allahabad',
  'varanasi',
  'meerut',
  'agra',
  'mathura',
  'bareilly',
  'gorakhpur',
  'aligarh',
  'moradabad',
  'jhansi',
  ' Saharanpur',
  'firozabad',
  ' Etawah',
  'azamgarh',
  'budaun',
  'bulandshahr',
  'hathras',
  'kasganj',
  'bijnor',
  'basti',
  'bahraich',
  'lalitpur',
  'siddharthnagar',
  'shamli',
  'gonda',
  'shravasti',
  'maharajganj',
  'pilibhit',
  'balia',
  'sultanpur',
  'amethi',
  'pratapgarh',
  'kushinagar',
  'sant kabir nagar',
  'sitapur',
  'barabanki',
  'unnao',
  'kanpur dehat',
  'etah',
  'mainpuri',
  'agrawal',
  'shamli',
  'gonda',
  'shravasti',
  'maharajganj',
  'pilibhit',
  'balia',
  'sultanpur',
  'amethi',
  'pratapgarh',
  'kushinagar',
  'sant kabir nagar',
  'sitapur',
  'barabanki',
  'unnao',
  'kanpur dehat',
  'etah',
  'mainpuri',
  'agrawal',

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
  ];

  // Dynamic [city] routes
  const cityRoutes: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${baseUrl}/mechanic-near-me-in-${city}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,   // high priority — these are your SEO money pages
  }));

  return [...staticRoutes, ...cityRoutes];
}
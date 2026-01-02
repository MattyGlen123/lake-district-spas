import { MetadataRoute } from 'next';
import { spaData } from '@/data/spas';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://lakedistrictspas.co.uk';

  // Homepage entry
  const homepage = {
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 1.0,
  };

  // Spa pages entries
  const spaPages = spaData.map((spa) => ({
    url: `${baseUrl}/spa/${spa.url}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [homepage, ...spaPages];
}

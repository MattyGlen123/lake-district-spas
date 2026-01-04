import { Spa } from '@/types/spa';

export function generateSpaSchema(spa: Spa) {
  const baseUrl = 'https://lakedistrictspas.co.uk';

  if (!spa.address) {
    // Fallback schema without address
    return {
      '@context': 'https://schema.org',
      '@type': 'HealthAndBeautyBusiness',
      name: spa.name,
      url: `${baseUrl}/spa/${spa.url}`,
      image: `${baseUrl}${spa.imageSrc}`,
      description:
        spa.metaDescription || `Discover ${spa.name} in ${spa.location}`,
    };
  }

  // Add amenityFeature for key facilities
  const amenities = [];
  if (spa.facilities.sauna)
    amenities.push({ '@type': 'LocationFeatureSpecification', name: 'Sauna' });
  if (spa.facilities.steamRoom)
    amenities.push({
      '@type': 'LocationFeatureSpecification',
      name: 'Steam Room',
    });
  if (spa.facilities.indoorPool)
    amenities.push({
      '@type': 'LocationFeatureSpecification',
      name: 'Indoor Pool',
    });
  if (spa.facilities.outdoorPool)
    amenities.push({
      '@type': 'LocationFeatureSpecification',
      name: 'Outdoor Pool',
    });
  if (spa.facilities.hotTub)
    amenities.push({
      '@type': 'LocationFeatureSpecification',
      name: 'Hot Tub',
    });
  if (spa.facilities.infraredSauna)
    amenities.push({
      '@type': 'LocationFeatureSpecification',
      name: 'Infrared Sauna',
    });
  if (spa.facilities.coldPlunge)
    amenities.push({
      '@type': 'LocationFeatureSpecification',
      name: 'Cold Plunge',
    });

  // Full schema with address
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HealthAndBeautyBusiness',
    name: spa.name,
    url: `${baseUrl}/spa/${spa.url}`,
    image: `${baseUrl}${spa.imageSrc}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: spa.address.street,
      addressLocality: spa.address.locality,
      addressRegion: spa.address.region,
      postalCode: spa.address.postcode,
      addressCountry: spa.address.country,
    },
    description:
      spa.metaDescription || `Discover ${spa.name} in ${spa.location}`,
    priceRange: '££-£££', // Typical spa pricing range
    ...(amenities.length > 0 && { amenityFeature: amenities }),
  };

  return schema;
}

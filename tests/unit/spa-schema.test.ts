import { describe, it, expect } from 'vitest';
import { generateSpaSchema } from '@/utils/generateSpaSchema';
import { spaData } from '@/data/spas';
import { Spa } from '@/types/spa';

const spaWithAddress = spaData.find((s) => s.address !== undefined);
const spaWithoutAddress = spaData.find((s) => s.address === undefined);
const lodoreFalls = spaData.find((s) => s.url === 'lodore-falls-spa')!;

describe('generateSpaSchema()', () => {
  it('always produces a valid Schema.org context and HealthAndBeautyBusiness type', () => {
    const schema = generateSpaSchema(lodoreFalls);
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('HealthAndBeautyBusiness');
  });

  it('includes the spa name', () => {
    const schema = generateSpaSchema(lodoreFalls);
    expect(schema.name).toBe(lodoreFalls.name);
  });

  it('URL contains the spa slug', () => {
    const schema = generateSpaSchema(lodoreFalls);
    expect(schema.url).toContain(lodoreFalls.url);
  });

  it('image URL includes the first image src', () => {
    const schema = generateSpaSchema(lodoreFalls);
    expect(schema.image).toContain(lodoreFalls.images[0].src);
  });

  it('uses metaDescription when provided', () => {
    const spa: Spa = { ...lodoreFalls, metaDescription: 'Custom description.' };
    const schema = generateSpaSchema(spa);
    expect(schema.description).toBe('Custom description.');
  });

  it('falls back to a generated description when metaDescription is absent', () => {
    const spa: Spa = { ...lodoreFalls, metaDescription: undefined };
    const schema = generateSpaSchema(spa);
    expect(schema.description).toContain(lodoreFalls.name);
  });

  it('includes PostalAddress when spa.address is present', () => {
    if (!spaWithAddress) {
      console.log('No spa with address found — skipping test');
      return;
    }
    const schema = generateSpaSchema(spaWithAddress) as {
      address?: { '@type': string; addressCountry: string };
    };
    expect(schema.address).toBeDefined();
    expect(schema.address!['@type']).toBe('PostalAddress');
    expect(schema.address!.addressCountry).toBeDefined();
  });

  it('omits PostalAddress when spa.address is absent', () => {
    if (!spaWithoutAddress) {
      console.log('All spas have addresses — skipping test');
      return;
    }
    const schema = generateSpaSchema(spaWithoutAddress) as { address?: unknown };
    expect(schema.address).toBeUndefined();
  });

  it('includes amenityFeature for facilities that are true', () => {
    const spa: Spa = {
      ...lodoreFalls,
      address: { street: '1 Lane', locality: 'Test', region: 'Cumbria', postcode: 'CA1', country: 'GB' },
      facilities: {
        ...lodoreFalls.facilities,
        sauna: true,
        steamRoom: true,
        indoorPool: false,
        outdoorPool: false,
        hotTub: false,
        infraredSauna: false,
        coldPlunge: false,
        iceRoom: false,
        thermalSuite: true,
      },
    };
    type SchemaWithAmenity = ReturnType<typeof generateSpaSchema> & {
      amenityFeature?: { '@type': string; name: string }[];
    };
    const schema = generateSpaSchema(spa) as SchemaWithAmenity;
    expect(schema.amenityFeature).toBeDefined();
    const names = schema.amenityFeature!.map((a) => a.name);
    expect(names).toContain('Sauna');
    expect(names).toContain('Steam Room');
    expect(names).not.toContain('Indoor Pool');
  });

  it('does not throw for any spa in spaData', () => {
    expect(() => {
      spaData.forEach((s) => generateSpaSchema(s));
    }).not.toThrow();
  });

  it('output is serialisable to JSON without throwing', () => {
    spaData.forEach((s) => {
      expect(() => JSON.stringify(generateSpaSchema(s))).not.toThrow();
    });
  });
});

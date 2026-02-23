import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { spaData } from '@/data/spas';
import { getDayPassOptionsBySpaId } from '@/data/day-passes';
import { getTreatmentsBySpaId } from '@/data/treatments';
import { getLowestDayPassPrice, getLowestTreatmentPrice } from '@/lib/prices';
import SpaCard from '@/components/SpaCard';
import { Treatment } from '@/types/spa';

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({
    fill: _fill,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean }) => (
    <img {...props} />
  ),
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
  } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('Price utilities', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
    jest.dontMock('@/data/treatments');
  });

  it('getLowestDayPassPrice returns the minimum day pass price for a spa with day passes', () => {
    const spaId = 1;
    const expected = Math.min(
      ...getDayPassOptionsBySpaId(spaId).map((option) => option.priceGBP)
    );

    expect(getLowestDayPassPrice(spaId)).toBe(expected);
  });

  it('getLowestDayPassPrice returns null for a spa without day passes', () => {
    expect(getLowestDayPassPrice(3)).toBeNull();
  });

  it('getLowestTreatmentPrice returns the minimum treatment price for a spa with treatments', () => {
    const spaId = 1;
    const expected = Math.min(
      ...getTreatmentsBySpaId(spaId)
        .filter((treatment) => treatment.price)
        .map((treatment) => parseFloat(treatment.price!.replace(/[£,]/g, '')))
        .filter((price) => !isNaN(price))
    );

    expect(getLowestTreatmentPrice(spaId)).toBe(expected);
  });

  it('getLowestTreatmentPrice returns null when treatments exist but none include price', () => {
    const treatmentsWithoutPrice: Treatment[] = [
      {
        spaId: 999,
        name: 'Signature Ritual',
        description: 'A relaxing full-body ritual.',
        shortDescription: 'Full-body ritual',
        duration: '60 minutes',
        category: 'Massage Therapies',
      },
      {
        spaId: 999,
        name: 'Hydrating Facial',
        description: 'A hydrating facial treatment.',
        shortDescription: 'Hydrating facial',
        duration: '50 minutes',
        category: 'Facial Treatments',
      },
    ];

    jest.isolateModules(() => {
      jest.doMock('@/data/treatments', () => {
        const actual = jest.requireActual('@/data/treatments');
        return {
          ...actual,
          getTreatmentsBySpaId: () => treatmentsWithoutPrice,
        };
      });

      const { getLowestTreatmentPrice: getLowestTreatmentPriceWithMock } =
        require('@/lib/prices');

      expect(getLowestTreatmentPriceWithMock(999)).toBeNull();
    });
  });

  it('getLowestTreatmentPrice returns null when no treatments exist', () => {
    expect(getLowestTreatmentPrice(11)).toBeNull();
  });

  it('getLowestTreatmentPrice handles comma-formatted prices', () => {
    const commaFormattedTreatments: Treatment[] = [
      {
        spaId: 998,
        name: 'Deluxe Journey',
        description: 'A premium treatment journey.',
        shortDescription: 'Premium journey',
        duration: '120 minutes',
        category: 'Body Treatments',
        price: '£1,200',
      },
      {
        spaId: 998,
        name: 'Express Ritual',
        description: 'A quick revitalising treatment.',
        shortDescription: 'Express ritual',
        duration: '30 minutes',
        category: 'Massage Therapies',
        price: '£950',
      },
    ];

    jest.isolateModules(() => {
      jest.doMock('@/data/treatments', () => {
        const actual = jest.requireActual('@/data/treatments');
        return {
          ...actual,
          getTreatmentsBySpaId: () => commaFormattedTreatments,
        };
      });

      const { getLowestTreatmentPrice: getLowestTreatmentPriceWithMock } =
        require('@/lib/prices');

      expect(getLowestTreatmentPriceWithMock(998)).toBe(950);
    });
  });
});

describe('SpaCard price rendering', () => {
  const spa = spaData[0];
  const normalizedText = (node: Element | null) =>
    (node?.textContent || '').replace(/Â/g, '');
  const hasExactText = (text: string) => (_: string, node: Element | null) =>
    node?.tagName.toLowerCase() === 'span' && normalizedText(node) === text;
  const includesText = (text: string) => (_: string, node: Element | null) =>
    normalizedText(node).includes(text);

  it('renders day pass price when lowestDayPassPrice is provided', () => {
    render(<SpaCard spa={spa} lowestDayPassPrice={55} />);
    expect(screen.getByText(hasExactText('Day Passes From £55'))).toBeInTheDocument();
  });

  it('renders treatment price when lowestTreatmentPrice is provided', () => {
    render(<SpaCard spa={spa} lowestTreatmentPrice={105} />);
    expect(screen.getByText(hasExactText('Treatments From £105'))).toBeInTheDocument();
  });

  it('renders both price rows when both prices are provided', () => {
    render(<SpaCard spa={spa} lowestDayPassPrice={60} lowestTreatmentPrice={120} />);
    expect(screen.getByText(hasExactText('Day Passes From £60'))).toBeInTheDocument();
    expect(screen.getByText(hasExactText('Treatments From £120'))).toBeInTheDocument();
  });

  it('renders neither price row when both price props are null', () => {
    render(<SpaCard spa={spa} lowestDayPassPrice={null} lowestTreatmentPrice={null} />);
    expect(screen.queryByText(includesText('Day Passes From £'))).not.toBeInTheDocument();
    expect(screen.queryByText(includesText('Treatments From £'))).not.toBeInTheDocument();
  });

  it('renders neither price row when both price props are omitted', () => {
    render(<SpaCard spa={spa} />);
    expect(screen.queryByText(includesText('Day Passes From £'))).not.toBeInTheDocument();
    expect(screen.queryByText(includesText('Treatments From £'))).not.toBeInTheDocument();
  });

  it('renders only treatment price when day pass price is null', () => {
    render(<SpaCard spa={spa} lowestDayPassPrice={null} lowestTreatmentPrice={85} />);
    expect(screen.queryByText(includesText('Day Passes From £'))).not.toBeInTheDocument();
    expect(screen.getByText(hasExactText('Treatments From £85'))).toBeInTheDocument();
  });

  it('renders only day pass price when treatment price is null', () => {
    render(<SpaCard spa={spa} lowestDayPassPrice={70} lowestTreatmentPrice={null} />);
    expect(screen.getByText(hasExactText('Day Passes From £70'))).toBeInTheDocument();
    expect(screen.queryByText(includesText('Treatments From £'))).not.toBeInTheDocument();
  });
});

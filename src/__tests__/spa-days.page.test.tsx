import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import SpaDaysPage from '@/app/spa-days/page';

type TestFacilities = {
  indoorPool: boolean;
  outdoorPool: boolean;
  iceRoom: boolean;
  coldPlunge: boolean;
  sauna: boolean;
  steamRoom: boolean;
  thermalSuite: boolean;
  hotTub: boolean;
};

type TestSpaSummary = {
  id: number;
  name: string;
  facilities: TestFacilities;
};

type TestDayPass = {
  id: string;
  spa: TestSpaSummary;
  packageName: string;
  description: string;
  included: string[];
  priceGBP: number;
  spaDuration: number;
  dayPassUrl: string;
  bookingUrl?: string;
  requiredNumbers?: string;
  pricePerPerson?: number;
  treatmentsIncluded: boolean;
  refreshmentsIncluded: boolean;
  mealIncluded: boolean;
};

const spaOne = {
  id: 1,
  name: 'Alpha Spa',
  facilities: {
    indoorPool: true,
    outdoorPool: false,
    iceRoom: false,
    coldPlunge: false,
    sauna: true,
    steamRoom: true,
    thermalSuite: true,
    hotTub: false,
  },
} satisfies TestSpaSummary;

const spaTwo = {
  id: 2,
  name: 'Beta Spa',
  facilities: {
    indoorPool: false,
    outdoorPool: true,
    iceRoom: false,
    coldPlunge: true,
    sauna: true,
    steamRoom: false,
    thermalSuite: false,
    hotTub: true,
  },
} satisfies TestSpaSummary;

const spaThree = {
  id: 3,
  name: 'Gamma Spa',
  facilities: {
    indoorPool: false,
    outdoorPool: false,
    iceRoom: true,
    coldPlunge: false,
    sauna: false,
    steamRoom: true,
    thermalSuite: false,
    hotTub: false,
  },
} satisfies TestSpaSummary;

const mockDayPasses: TestDayPass[] = [
  {
    id: 'single-cheap',
    spa: spaOne,
    packageName: 'Single Calm Pass',
    description: 'Single pass',
    included: ['Pool'],
    priceGBP: 60,
    spaDuration: 2,
    dayPassUrl: 'https://example.com/single',
    bookingUrl: 'https://example.com/single-book',
    treatmentsIncluded: true,
    refreshmentsIncluded: true,
    mealIncluded: false,
  },
  {
    id: 'couples-mid',
    spa: spaTwo,
    packageName: 'Couples Escape',
    description: 'Couples pass',
    included: ['Pool', 'Snack'],
    priceGBP: 140,
    spaDuration: 3,
    dayPassUrl: 'https://example.com/couples',
    bookingUrl: 'https://example.com/couples-book',
    requiredNumbers: '2 people',
    pricePerPerson: 70,
    treatmentsIncluded: true,
    refreshmentsIncluded: true,
    mealIncluded: false,
  },
  {
    id: 'groups-premium',
    spa: spaThree,
    packageName: 'Group Retreat',
    description: 'Group pass',
    included: ['Thermal'],
    priceGBP: 230,
    spaDuration: 4,
    dayPassUrl: 'https://example.com/group',
    bookingUrl: 'https://example.com/group-book',
    requiredNumbers: '4-8 guests',
    treatmentsIncluded: false,
    refreshmentsIncluded: true,
    mealIncluded: true,
  },
  ...Array.from({ length: 92 }, (_, idx): TestDayPass => {
    const spa = [spaOne, spaTwo, spaThree][idx % 3];
    const price = [80, 120, 180, 240][idx % 4];
    const duration = [2, 3, 4][idx % 3];
    const isCouple = idx % 5 === 0;
    return {
      id: `generated-${idx + 1}`,
      spa,
      packageName: `Pass ${String(idx + 1).padStart(3, '0')}`,
      description: `Generated pass ${idx + 1}`,
      included: ['Spa access'],
      priceGBP: price,
      spaDuration: duration,
      dayPassUrl: `https://example.com/pass-${idx + 1}`,
      bookingUrl: `https://example.com/book-${idx + 1}`,
      requiredNumbers: isCouple ? '2 people' : undefined,
      pricePerPerson: isCouple ? Math.floor(price / 2) : undefined,
      treatmentsIncluded: idx % 2 === 0,
      refreshmentsIncluded: idx % 3 === 0,
      mealIncluded: idx % 4 === 0,
    };
  }),
];

type FilterState = {
  maxPrice: number;
  facilities: string[];
};

const calculateExpectedCount = (state: FilterState) =>
  mockDayPasses.filter((pass) => {
    if (pass.priceGBP > state.maxPrice) return false;

    if (state.facilities.length > 0) {
      const poolFilters = ['indoorPool', 'outdoorPool'];
      const selectedPools = state.facilities.filter((f) => poolFilters.includes(f));
      const hasIceRoomFilter = state.facilities.includes('iceRoom');
      const otherFacilities = state.facilities.filter(
        (f) => !poolFilters.includes(f) && f !== 'iceRoom'
      );

      if (selectedPools.length > 0) {
        const hasAnyPool = selectedPools.some((pool) => {
          const key = pool as keyof typeof pass.spa.facilities;
          return pass.spa.facilities[key];
        });
        if (!hasAnyPool) return false;
      }

      if (hasIceRoomFilter) {
        if (!pass.spa.facilities.iceRoom && !pass.spa.facilities.coldPlunge) return false;
      }

      if (otherFacilities.length > 0) {
        const hasAllOther = otherFacilities.every((facility) => {
          const key = facility as keyof typeof pass.spa.facilities;
          return pass.spa.facilities[key];
        });
        if (!hasAllOther) return false;
      }
    }

    return true;
  }).length;

jest.mock('next/image', () => ({
  __esModule: true,
  default: () => <span data-testid="next-image-mock" />,
}));

jest.mock('@/components/Header', () => ({
  __esModule: true,
  default: () => <header data-testid="header-mock" />,
}));

jest.mock('@/components/Footer', () => ({
  __esModule: true,
  default: () => <footer data-testid="footer-mock" />,
}));

jest.mock('@/components/ui/dropdown-menu', () => ({
  __esModule: true,
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuTrigger: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props}>{children}</button>,
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuItem: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => <button onClick={onClick}>{children}</button>,
}));

jest.mock('@/components/DayPassCard', () => ({
  __esModule: true,
  default: ({
    dayPass,
    spa,
  }: {
    dayPass: TestDayPass;
    spa: TestSpaSummary;
  }) => (
    <article
      data-testid="day-pass-card"
      data-name={dayPass.packageName}
      data-price={dayPass.priceGBP}
      data-duration={dayPass.spaDuration}
      data-spa={spa.name}
    >
      {dayPass.packageName}
    </article>
  ),
}));

jest.mock('@/components/DayPassFilters', () => ({
  __esModule: true,
  default: ({
    isOpen,
    filteredCount,
    selectedFacilities,
    onMaxPriceChange,
    onFacilityChange,
    onApply,
    onClose,
    onClearFilters,
  }: {
    isOpen: boolean;
    filteredCount: number;
    selectedFacilities: string[];
    onMaxPriceChange: (value: number) => void;
    onFacilityChange: (facility: string) => void;
    onApply: () => void;
    onClose: () => void;
    onClearFilters: () => void;
  }) => {
    if (!isOpen) return null;
    return (
      <div data-testid="day-pass-filters-modal">
        <p data-testid="temp-filtered-count">{filteredCount}</p>
        <button onClick={() => onMaxPriceChange(100)}>Set Max 100</button>
        <button onClick={() => onMaxPriceChange(0)}>Set Max 0</button>
        <button onClick={() => onFacilityChange('indoorPool')}>Toggle Indoor Pool</button>
        <button onClick={() => onFacilityChange('outdoorPool')}>Toggle Outdoor Pool</button>
        <button onClick={() => onFacilityChange('iceRoom')}>Toggle Ice Room</button>
        <button onClick={() => onFacilityChange('sauna')}>Toggle Sauna</button>
        <button onClick={() => selectedFacilities.forEach(onFacilityChange)}>
          Clear Facilities
        </button>
        <button onClick={onApply}>Apply</button>
        <button onClick={onClose}>Close</button>
        <button onClick={onClearFilters}>Clear Filters</button>
      </div>
    );
  },
}));

jest.mock('@/data/day-passes', () => ({
  __esModule: true,
  getAllDayPassesWithSpa: jest.fn(() => mockDayPasses),
  getDayPassOptionsBySpaId: jest.fn((spaId: number) => {
    const options = mockDayPasses.filter((p) => p.spa.id === spaId);
    return options.map((p) => ({ ...p, priceGBP: p.priceGBP }));
  }),
}));

describe('spa-days page', () => {
  beforeAll(() => {
    window.scrollTo = jest.fn();
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      writable: true,
      value: jest.fn(),
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const getCardPrices = () =>
    screen
      .getAllByTestId('day-pass-card')
      .map((card) => Number(card.getAttribute('data-price')));

  const getCardDurations = () =>
    screen
      .getAllByTestId('day-pass-card')
      .map((card) => Number(card.getAttribute('data-duration')));

  const getCardNames = () =>
    screen
      .getAllByTestId('day-pass-card')
      .map((card) => card.getAttribute('data-name'));

  const expectShowingDayPasses = (count: number) => {
    const target = `Showing ${count} day passes`;
    const countTexts = screen.getAllByText((_, node) =>
      (node?.textContent ?? '').replace(/\s+/g, ' ').includes(target)
    );
    expect(countTexts.length).toBeGreaterThan(0);
  };

  it('renders first page with 12 cards and condensed pagination for many pages', () => {
    render(<SpaDaysPage />);

    expect(screen.getAllByTestId('day-pass-card')).toHaveLength(12);
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '8' })).toBeInTheDocument();
    expect(screen.getByText('...')).toBeInTheDocument();
  });

  it('keeps modal changes temporary until apply and discards them on close', async () => {
    render(<SpaDaysPage />);

    const expectedUnder100 = calculateExpectedCount({
      maxPrice: 100,
      facilities: [],
    });

    expectShowingDayPasses(mockDayPasses.length);

    fireEvent.click(screen.getAllByRole('button', { name: /filters/i })[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Set Max 100' }));

    expect(screen.getByTestId('temp-filtered-count')).toHaveTextContent(
      String(expectedUnder100)
    );
    expectShowingDayPasses(mockDayPasses.length);

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    await waitFor(() =>
      expect(screen.queryByTestId('day-pass-filters-modal')).not.toBeInTheDocument()
    );
    expectShowingDayPasses(mockDayPasses.length);

    fireEvent.click(screen.getAllByRole('button', { name: /filters/i })[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Set Max 100' }));
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));

    await waitFor(() => expectShowingDayPasses(expectedUnder100));
  });

  it('applies mixed facilities logic with pool OR and other facilities AND', async () => {
    render(<SpaDaysPage />);

    fireEvent.click(screen.getAllByRole('button', { name: /filters/i })[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Toggle Indoor Pool' }));
    fireEvent.click(screen.getByRole('button', { name: 'Toggle Outdoor Pool' }));
    fireEvent.click(screen.getByRole('button', { name: 'Toggle Sauna' }));
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));

    const expectedCount = calculateExpectedCount({
      maxPrice: 250,
      facilities: ['indoorPool', 'outdoorPool', 'sauna'],
    });

    await waitFor(() => expectShowingDayPasses(expectedCount));
  });

  it('shows empty state and clear-all restores results', async () => {
    render(<SpaDaysPage />);

    fireEvent.click(screen.getAllByRole('button', { name: /filters/i })[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Set Max 0' }));
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));

    await waitFor(() =>
      expect(screen.getByText('No day passes match your filters')).toBeInTheDocument()
    );

    fireEvent.click(screen.getByRole('button', { name: 'Clear all filters' }));
    await waitFor(() =>
      expect(screen.queryByText('No day passes match your filters')).not.toBeInTheDocument()
    );

    expect(screen.getAllByTestId('day-pass-card')).toHaveLength(12);
  });

  it('resets pagination to page 1 when sort changes', async () => {
    render(<SpaDaysPage />);

    fireEvent.click(screen.getByRole('button', { name: '2' }));
    const pageTwoFirstName = getCardNames()[0];

    fireEvent.click(
      screen.getAllByRole('button', { name: 'Duration: Shortest First' })[0]
    );

    await waitFor(() => expect(getCardDurations()[0]).toBe(2));
    expect(screen.getAllByTestId('day-pass-card')[0]).not.toHaveAttribute(
      'data-name',
      pageTwoFirstName
    );
  });

  it('supports sort by price low to high and high to low', () => {
    render(<SpaDaysPage />);

    fireEvent.click(screen.getAllByRole('button', { name: 'Price: Low to High' })[0]);
    expect(getCardPrices()[0]).toBe(60);

    fireEvent.click(screen.getAllByRole('button', { name: 'Price: High to Low' })[0]);
    expect(getCardPrices()[0]).toBe(240);
  });

  it('does not auto-scroll on initial render', () => {
    render(<SpaDaysPage />);

    const scrollIntoViewMock = HTMLElement.prototype.scrollIntoView as jest.Mock;
    expect(scrollIntoViewMock).not.toHaveBeenCalled();
  });

  it('scrolls to results when a page number is clicked', () => {
    render(<SpaDaysPage />);

    const scrollIntoViewMock = HTMLElement.prototype.scrollIntoView as jest.Mock;
    fireEvent.click(screen.getByRole('button', { name: '2' }));

    expect(scrollIntoViewMock).toHaveBeenCalledTimes(1);
    expect(scrollIntoViewMock).toHaveBeenLastCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
  });

  it('scrolls to results when next page is clicked', () => {
    render(<SpaDaysPage />);

    const scrollIntoViewMock = HTMLElement.prototype.scrollIntoView as jest.Mock;
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));

    expect(scrollIntoViewMock).toHaveBeenCalledTimes(1);
    expect(scrollIntoViewMock).toHaveBeenLastCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
  });
});

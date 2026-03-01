import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import SpaTreatmentsPage from '@/app/spa-treatments/page';
import { TreatmentCategory } from '@/types/spa';

type TestSpaSummary = {
  id: number;
  name: string;
};

type TestTreatment = {
  spaId: number;
  spa: TestSpaSummary;
  name: string;
  category: TreatmentCategory;
  duration: string;
  shortDescription: string;
  description: string;
  price?: string;
};

const spaA: TestSpaSummary = { id: 1, name: 'Alpha Spa' };
const spaB: TestSpaSummary = { id: 2, name: 'Beta Spa' };
const spaC: TestSpaSummary = { id: 3, name: 'Gamma Spa' };

const mockTreatments: TestTreatment[] = [
  {
    spaId: 1,
    spa: spaA,
    name: 'A Calm Ritual',
    category: 'Massage Therapies',
    duration: '60 minutes',
    shortDescription: 'Relaxing massage',
    description: 'Relaxing massage',
    price: '£70',
  },
  {
    spaId: 2,
    spa: spaB,
    name: 'B Glow Facial',
    category: 'Facial Treatments',
    duration: '60 minutes',
    shortDescription: 'Glow facial',
    description: 'Glow facial',
    price: '£90',
  },
  {
    spaId: 3,
    spa: spaC,
    name: 'C Deep Reset',
    category: 'Body Treatments',
    duration: '75 minutes',
    shortDescription: 'Body treatment',
    description: 'Body treatment',
    price: '£120',
  },
  {
    spaId: 1,
    spa: spaA,
    name: 'D Elite Escape',
    category: 'Massage Therapies',
    duration: '90 minutes',
    shortDescription: 'Premium treatment',
    description: 'Premium treatment',
    price: '£160',
  },
  ...Array.from({ length: 92 }, (_, idx): TestTreatment => {
    const spa = [spaA, spaB, spaC][idx % 3];
    const price = [55, 80, 110, 170][idx % 4];
    const categoryOptions: TreatmentCategory[] = [
      'Massage Therapies',
      'Facial Treatments',
      'Body Treatments',
    ];
    const category = categoryOptions[idx % 3];
    return {
      spaId: spa.id,
      spa,
      name: `Treatment ${String(idx + 1).padStart(3, '0')}`,
      category,
      duration: `${45 + (idx % 4) * 15} minutes`,
      shortDescription: `Description ${idx + 1}`,
      description: `Description ${idx + 1}`,
      price: `£${price}`,
    };
  }),
];

const parsePounds = (value: string) => Number(value.replace(/[^\d]/g, ''));

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

jest.mock('@/components/TreatmentPickCard', () => ({
  __esModule: true,
  default: ({
    treatment,
    spa,
  }: {
    treatment: TestTreatment;
    spa: TestSpaSummary;
  }) => (
    <article
      data-testid="treatment-card"
      data-name={treatment.name}
      data-price={treatment.price ?? ''}
      data-spa={spa.name}
    >
      {treatment.name}
    </article>
  ),
}));

jest.mock('@/components/TreatmentFilters', () => {
  return {
    __esModule: true,
    CATEGORY_GROUPS: [
      { label: 'Body & Massage', categories: ['Massage Therapies', 'Body Treatments'] },
      { label: 'Facial Treatments', categories: ['Facial Treatments'] },
      { label: 'Hands & Feet', categories: ['Hands & Feet Treatments'] },
    ],
    ALL_CATEGORY_GROUP_LABELS: [
      'Body & Massage',
      'Facial Treatments',
      'Hands & Feet',
    ],
    default: ({
      isOpen,
      filteredCount,
      selectedCategories,
      availableSpas,
      onPriceBracketChange,
      onCategoryChange,
      onDeselectAllSpas,
      onSelectAllSpas,
      onSpaChange,
      onApply,
      onClose,
      onClearFilters,
    }: {
      isOpen: boolean;
      filteredCount: number;
      selectedCategories: string[];
      availableSpas: { id: number; name: string }[];
      onPriceBracketChange: (value: 'under-75') => void;
      onCategoryChange: (value: string) => void;
      onDeselectAllSpas: () => void;
      onSelectAllSpas: () => void;
      onSpaChange: (id: number) => void;
      onApply: () => void;
      onClose: () => void;
      onClearFilters: () => void;
    }) => {
      if (!isOpen) return null;
      return (
        <div data-testid="treatment-filters-modal">
          <p data-testid="temp-filtered-count">{filteredCount}</p>
          <button onClick={() => onPriceBracketChange('under-75')}>Toggle Under 75</button>
          <button onClick={() => selectedCategories.forEach(onCategoryChange)}>
            Clear Categories
          </button>
          <button onClick={onDeselectAllSpas}>Deselect All Spas</button>
          <button onClick={onSelectAllSpas}>Select All Spas</button>
          <button
            onClick={() => {
              if (availableSpas.length > 0) {
                onSpaChange(availableSpas[0].id);
              }
            }}
          >
            Toggle First Spa
          </button>
          <button onClick={onApply}>Apply</button>
          <button onClick={onClose}>Close</button>
          <button onClick={onClearFilters}>Clear Filters</button>
        </div>
      );
    },
  };
});

jest.mock('@/data/treatments', () => ({
  __esModule: true,
  getAllTreatmentsWithSpa: jest.fn(() => mockTreatments),
  parseTreatmentPrice: jest.fn((price: string) => parsePounds(price)),
  getTreatmentsBySpaId: jest.fn((spaId: number) =>
    mockTreatments.filter((t) => t.spaId === spaId).map((t) => ({ ...t, price: t.price }))
  ),
}));

describe('spa-treatments page', () => {
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

  const getCardNames = () =>
    screen
      .getAllByTestId('treatment-card')
      .map((card) => card.getAttribute('data-name'));

  const getCardPrices = () =>
    screen
      .getAllByTestId('treatment-card')
      .map((card) => parsePounds(card.getAttribute('data-price') ?? '0'));

  const expectShowingTreatments = (count: number) => {
    const target = `Showing ${count} treatments`;
    const countTexts = screen.getAllByText((_, node) =>
      (node?.textContent ?? '').replace(/\s+/g, ' ').includes(target)
    );
    expect(countTexts.length).toBeGreaterThan(0);
  };

  it('renders first page with 12 cards and condensed pagination for many pages', () => {
    render(<SpaTreatmentsPage />);

    expect(screen.getAllByTestId('treatment-card')).toHaveLength(12);
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '8' })).toBeInTheDocument();
    expect(screen.getByText('...')).toBeInTheDocument();
  });

  it('sorts by price low/high and high/low', () => {
    render(<SpaTreatmentsPage />);

    fireEvent.click(screen.getAllByRole('button', { name: 'Price: Low to High' })[0]);
    expect(getCardPrices()[0]).toBe(55);

    fireEvent.click(screen.getAllByRole('button', { name: 'Price: High to Low' })[0]);
    expect(getCardPrices()[0]).toBe(170);
  });

  it('keeps filter changes temporary until apply and discards changes on close', async () => {
    render(<SpaTreatmentsPage />);

    const under75Count = mockTreatments.filter(
      (item) => parsePounds(item.price ?? '0') < 75
    ).length;

    expectShowingTreatments(mockTreatments.length);

    fireEvent.click(screen.getAllByRole('button', { name: /filters/i })[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Toggle Under 75' }));

    expect(screen.getByTestId('temp-filtered-count')).toHaveTextContent(
      String(under75Count)
    );
    expectShowingTreatments(mockTreatments.length);

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    await waitFor(() =>
      expect(screen.queryByTestId('treatment-filters-modal')).not.toBeInTheDocument()
    );
    expectShowingTreatments(mockTreatments.length);

    fireEvent.click(screen.getAllByRole('button', { name: /filters/i })[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Toggle Under 75' }));
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));

    await waitFor(() => expectShowingTreatments(under75Count));
  });

  it('shows empty state when all categories are deselected and clear-all restores results', async () => {
    render(<SpaTreatmentsPage />);

    fireEvent.click(screen.getAllByRole('button', { name: /filters/i })[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Clear Categories' }));
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));

    await waitFor(() =>
      expect(screen.getByText('No treatments match your filters')).toBeInTheDocument()
    );

    fireEvent.click(screen.getByRole('button', { name: 'Clear all filters' }));

    await waitFor(() =>
      expect(screen.queryByText('No treatments match your filters')).not.toBeInTheDocument()
    );
    expect(screen.getAllByTestId('treatment-card')).toHaveLength(12);
  });

  it('resets pagination to page 1 when filters are applied', async () => {
    render(<SpaTreatmentsPage />);

    fireEvent.click(screen.getByRole('button', { name: '2' }));
    const pageTwoFirstName = getCardNames()[0];

    fireEvent.click(screen.getAllByRole('button', { name: /filters/i })[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Toggle Under 75' }));
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));

    const expectedFirstFilteredName = [...mockTreatments]
      .filter((item) => parsePounds(item.price ?? '0') < 75)
      .sort((a, b) => a.name.localeCompare(b.name))[0].name;

    await waitFor(() =>
      expect(screen.getAllByTestId('treatment-card')[0]).toHaveAttribute(
        'data-name',
        expectedFirstFilteredName
      )
    );
    expect(screen.getAllByTestId('treatment-card')[0]).not.toHaveAttribute(
      'data-name',
      pageTwoFirstName
    );
  });

  it('does not auto-scroll on initial render', () => {
    render(<SpaTreatmentsPage />);

    const scrollIntoViewMock = HTMLElement.prototype.scrollIntoView as jest.Mock;
    expect(scrollIntoViewMock).not.toHaveBeenCalled();
  });

  it('scrolls to results when a page number is clicked', () => {
    render(<SpaTreatmentsPage />);

    const scrollIntoViewMock = HTMLElement.prototype.scrollIntoView as jest.Mock;
    fireEvent.click(screen.getByRole('button', { name: '2' }));

    expect(scrollIntoViewMock).toHaveBeenCalledTimes(1);
    expect(scrollIntoViewMock).toHaveBeenLastCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
  });

  it('scrolls to results when next page is clicked', () => {
    render(<SpaTreatmentsPage />);

    const scrollIntoViewMock = HTMLElement.prototype.scrollIntoView as jest.Mock;
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));

    expect(scrollIntoViewMock).toHaveBeenCalledTimes(1);
    expect(scrollIntoViewMock).toHaveBeenLastCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
  });
});

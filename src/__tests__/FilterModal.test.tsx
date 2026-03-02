import React from 'react';
import { vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import FilterModal from '@/components/FilterModal';
import type { AccessLabel } from '@/types/spa';

/** Helper: find the Radix Checkbox <button role="checkbox"> inside a label whose
 * trimmed text content exactly matches the given string. */
function getCheckboxByLabelText(text: string): HTMLElement {
  const allCheckboxes = screen.getAllByRole('checkbox');
  const found = allCheckboxes.find((btn) =>
    btn.closest('label')?.textContent?.trim() === text,
  );
  if (!found) throw new Error(`Checkbox not found for label text: "${text}"`);
  return found;
}

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
  onApply: vi.fn(),
  selectedAccessLabels: [] as AccessLabel[],
  onAccessLabelChange: vi.fn(),
  selectedLocation: 'All Locations',
  onLocationChange: vi.fn(),
  selectedFacilities: [] as string[],
  onFacilityChange: vi.fn(),
  onClearFilters: vi.fn(),
  filteredCount: 19,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('FilterModal', () => {
  describe('visibility', () => {
    it('renders nothing when isOpen is false', () => {
      const { container } = render(<FilterModal {...defaultProps} isOpen={false} />);
      expect(container.firstChild).toBeNull();
    });

    it('renders the modal when isOpen is true', () => {
      render(<FilterModal {...defaultProps} />);
      expect(screen.getByRole('heading', { level: 2, name: 'Refine Search' })).toBeInTheDocument();
    });
  });

  describe('filteredCount display', () => {
    it('shows the filtered count in the apply button', () => {
      render(<FilterModal {...defaultProps} filteredCount={7} />);
      expect(screen.getByRole('button', { name: /show 7 results/i })).toBeInTheDocument();
    });

    it('uses singular "result" when filteredCount is 1', () => {
      render(<FilterModal {...defaultProps} filteredCount={1} />);
      expect(screen.getByRole('button', { name: /show 1 result/i })).toBeInTheDocument();
    });
  });

  describe('close behaviour', () => {
    it('calls onClose when the X button is clicked', () => {
      const onClose = vi.fn();
      render(<FilterModal {...defaultProps} onClose={onClose} />);
      // X button: button without text that contains an icon
      const closeButton = screen.getByRole('heading', { level: 2 })
        .closest('div')
        ?.parentElement?.querySelector('button');
      expect(closeButton).toBeInTheDocument();
      fireEvent.click(closeButton!);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when the backdrop is clicked', () => {
      const onClose = vi.fn();
      const { container } = render(<FilterModal {...defaultProps} onClose={onClose} />);
      const backdrop = container.querySelector('.backdrop-blur-md');
      expect(backdrop).toBeInTheDocument();
      fireEvent.click(backdrop!);
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Reset All button', () => {
    it('calls onClearFilters when "Reset All" is clicked', () => {
      const onClearFilters = vi.fn();
      render(<FilterModal {...defaultProps} onClearFilters={onClearFilters} />);
      fireEvent.click(screen.getByRole('button', { name: /reset all/i }));
      expect(onClearFilters).toHaveBeenCalledTimes(1);
    });
  });

  describe('apply button', () => {
    it('calls onApply when the Show results button is clicked', () => {
      const onApply = vi.fn();
      render(<FilterModal {...defaultProps} onApply={onApply} />);
      fireEvent.click(screen.getByRole('button', { name: /show 19 results/i }));
      expect(onApply).toHaveBeenCalledTimes(1);
    });
  });

  describe('access label checkboxes', () => {
    it('renders access label checkboxes with correct labels', () => {
      render(<FilterModal {...defaultProps} />);
      // 'Day passes available' label should be visible
      expect(screen.getByText('Day passes available')).toBeInTheDocument();
      expect(screen.getByText('Free for all hotel guests')).toBeInTheDocument();
    });

    it('marks selectedAccessLabels as checked', () => {
      render(
        <FilterModal
          {...defaultProps}
          selectedAccessLabels={['day-passes-available']}
        />,
      );
      const checkbox = getCheckboxByLabelText('Day passes available');
      expect(checkbox).toHaveAttribute('aria-checked', 'true');
    });

    it('marks unselected access labels as unchecked', () => {
      render(<FilterModal {...defaultProps} selectedAccessLabels={[]} />);
      const checkbox = getCheckboxByLabelText('Day passes available');
      expect(checkbox).toHaveAttribute('aria-checked', 'false');
    });

    it('calls onAccessLabelChange with the correct label when clicked', () => {
      const onAccessLabelChange = vi.fn();
      render(
        <FilterModal {...defaultProps} onAccessLabelChange={onAccessLabelChange} />,
      );
      const checkbox = getCheckboxByLabelText('Day passes available');
      fireEvent.click(checkbox);
      expect(onAccessLabelChange).toHaveBeenCalledWith('day-passes-available');
    });
  });

  describe('facility checkboxes', () => {
    it('renders facility filter options', () => {
      render(<FilterModal {...defaultProps} />);
      expect(screen.getByText('Sauna')).toBeInTheDocument();
      expect(screen.getByText('Indoor Pool')).toBeInTheDocument();
    });

    it('calls onFacilityChange with the correct key when a facility is clicked', () => {
      const onFacilityChange = vi.fn();
      render(<FilterModal {...defaultProps} onFacilityChange={onFacilityChange} />);
      const checkbox = getCheckboxByLabelText('Sauna');
      fireEvent.click(checkbox);
      expect(onFacilityChange).toHaveBeenCalledWith('sauna');
    });

    it('marks selected facilities as checked', () => {
      render(<FilterModal {...defaultProps} selectedFacilities={['sauna']} />);
      const checkbox = getCheckboxByLabelText('Sauna');
      expect(checkbox).toHaveAttribute('aria-checked', 'true');
    });
  });

  describe('location checkboxes', () => {
    it('renders location filter options', () => {
      render(<FilterModal {...defaultProps} />);
      expect(screen.getByText('Windermere')).toBeInTheDocument();
      expect(screen.getByText('Borrowdale')).toBeInTheDocument();
    });

    it('calls onLocationChange when a location checkbox is clicked', () => {
      const onLocationChange = vi.fn();
      render(<FilterModal {...defaultProps} onLocationChange={onLocationChange} />);
      const checkbox = getCheckboxByLabelText('Windermere');
      fireEvent.click(checkbox);
      expect(onLocationChange).toHaveBeenCalledWith('Windermere');
    });

    it('marks the selected location as checked', () => {
      render(<FilterModal {...defaultProps} selectedLocation="Windermere" />);
      const checkbox = getCheckboxByLabelText('Windermere');
      expect(checkbox).toHaveAttribute('aria-checked', 'true');
    });
  });
});

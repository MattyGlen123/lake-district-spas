import { getPageTokens } from '@/lib/listing/pageTokens';

describe('getPageTokens', () => {
  it('returns all pages when total pages are 7 or fewer', () => {
    expect(getPageTokens(1, 0)).toEqual([]);
    expect(getPageTokens(1, 1)).toEqual([1]);
    expect(getPageTokens(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('returns condensed tokens near the start', () => {
    expect(getPageTokens(1, 8)).toEqual([1, 2, '...', 8]);
    expect(getPageTokens(2, 10)).toEqual([1, 2, 3, '...', 10]);
    expect(getPageTokens(3, 10)).toEqual([1, 2, 3, 4, '...', 10]);
  });

  it('returns condensed tokens in the middle', () => {
    expect(getPageTokens(5, 10)).toEqual([1, '...', 4, 5, 6, '...', 10]);
  });

  it('returns condensed tokens near the end', () => {
    expect(getPageTokens(8, 10)).toEqual([1, '...', 7, 8, 9, 10]);
    expect(getPageTokens(10, 10)).toEqual([1, '...', 9, 10]);
  });
});

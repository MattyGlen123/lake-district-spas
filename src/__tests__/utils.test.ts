import { cn } from '@/lib/utils';

describe('Utility Functions', () => {
  describe('cn (class name utility)', () => {
    it('should merge class names correctly', () => {
      expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('should handle conditional classes', () => {
      expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
      expect(cn('foo', true && 'bar', 'baz')).toBe('foo bar baz');
    });

    it('should handle undefined and null', () => {
      expect(cn('foo', undefined, 'bar', null, 'baz')).toBe('foo bar baz');
    });

    it('should merge Tailwind classes correctly', () => {
      const result1 = cn('px-2 py-1', 'px-4');
      expect(result1).toContain('px-4');
      expect(result1).toContain('py-1');
      expect(result1).not.toContain('px-2');

      expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
    });

    it('should handle empty strings', () => {
      expect(cn('foo', '', 'bar')).toBe('foo bar');
    });

    it('should handle arrays', () => {
      expect(cn(['foo', 'bar'], 'baz')).toBe('foo bar baz');
    });

    it('should handle objects', () => {
      expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz');
    });
  });
});

import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn utility', () => {
  it('merges class names', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('handles conditional classes', () => {
    expect(cn('base', true && 'conditional')).toBe('base conditional');
    expect(cn('base', false && 'conditional')).toBe('base');
  });

  it('handles undefined and null values', () => {
    expect(cn('base', undefined, null, 'end')).toBe('base end');
  });

  it('merges conflicting Tailwind classes', () => {
    // twMerge should keep the last conflicting class
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });

  it('handles arrays of class names', () => {
    expect(cn(['class1', 'class2'])).toBe('class1 class2');
  });

  it('handles object syntax', () => {
    expect(cn({ active: true, disabled: false })).toBe('active');
  });

  it('handles complex combinations', () => {
    const result = cn(
      'base',
      'px-4 py-2',
      { 'bg-blue-500': true, 'opacity-50': false },
      ['text-white', 'rounded']
    );
    expect(result).toContain('base');
    expect(result).toContain('px-4');
    expect(result).toContain('py-2');
    expect(result).toContain('bg-blue-500');
    expect(result).not.toContain('opacity-50');
    expect(result).toContain('text-white');
    expect(result).toContain('rounded');
  });

  it('returns empty string for no input', () => {
    expect(cn()).toBe('');
  });

  it('handles duplicate classes', () => {
    // clsx/twMerge don't dedupe non-conflicting classes
    expect(cn('base', 'base')).toContain('base');
  });
});

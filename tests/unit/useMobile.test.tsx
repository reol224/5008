import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useIsMobile } from '@/hooks/use-mobile';

describe('useIsMobile', () => {
  let originalInnerWidth: number;
  let matchMediaMock: ReturnType<typeof vi.fn>;
  let listeners: Map<string, (e: { matches: boolean }) => void>;

  beforeEach(() => {
    originalInnerWidth = window.innerWidth;
    listeners = new Map();

    matchMediaMock = vi.fn((query: string) => ({
      matches: window.innerWidth < 768,
      media: query,
      addEventListener: vi.fn((event: string, callback: (e: { matches: boolean }) => void) => {
        listeners.set(event, callback);
      }),
      removeEventListener: vi.fn((event: string) => {
        listeners.delete(event);
      }),
    }));

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: matchMediaMock,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: originalInnerWidth,
    });
    vi.restoreAllMocks();
  });

  it('returns false for desktop width', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 1024,
    });

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);
  });

  it('returns true for mobile width', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 500,
    });

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);
  });

  it('returns false at exactly 768px (not mobile)', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 768,
    });

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);
  });

  it('returns true at 767px (mobile)', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 767,
    });

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);
  });

  it('calls matchMedia with correct breakpoint', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 1024,
    });

    renderHook(() => useIsMobile());

    expect(matchMediaMock).toHaveBeenCalledWith('(max-width: 767px)');
  });

  it('adds event listener on mount', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 1024,
    });

    renderHook(() => useIsMobile());

    expect(listeners.has('change')).toBe(true);
  });

  it('removes event listener on unmount', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 1024,
    });

    const { unmount } = renderHook(() => useIsMobile());
    unmount();

    // The removeEventListener was called
    const mediaQuery = matchMediaMock.mock.results[0].value;
    expect(mediaQuery.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('updates when window is resized', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 1024,
    });

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);

    // Simulate resize to mobile
    act(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 500,
      });
      const changeListener = listeners.get('change');
      if (changeListener) {
        changeListener({ matches: true });
      }
    });

    expect(result.current).toBe(true);
  });

  it('starts with undefined and then resolves', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 1024,
    });

    // The hook initializes to false after useEffect runs
    const { result } = renderHook(() => useIsMobile());

    // After effect runs, it should be false
    expect(result.current).toBe(false);
  });
});

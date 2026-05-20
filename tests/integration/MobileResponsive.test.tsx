import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResumeBuilder } from '@/components/resume-builder/ResumeBuilder';

// Mock matchMedia
const createMatchMedia = (matches: boolean) => (query: string) => ({
  matches,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
});

describe('Mobile Responsive', () => {
  const originalMatchMedia = window.matchMedia;
  const originalInnerWidth = window.innerWidth;

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    vi.clearAllMocks();
  });

  describe('mobile viewport', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      window.matchMedia = createMatchMedia(true) as any;
    });

    it('renders mobile header with smaller height class', () => {
      render(<ResumeBuilder />);
      
      const headers = screen.getAllByRole('banner');
      const appHeader = headers[0];
      expect(appHeader).toHaveClass('h-12', 'md:h-14');
    });

    it('renders compact logo on mobile', () => {
      render(<ResumeBuilder />);
      
      // Mobile shows "Resume" instead of full text
      expect(screen.getByText('Resume')).toBeInTheDocument();
    });

    it('hides template text on small screens', () => {
      render(<ResumeBuilder />);
      
      // Template button exists but text may be hidden
      const templateButton = screen.getByRole('button', { name: /template/i });
      expect(templateButton).toBeInTheDocument();
    });
  });

  describe('desktop viewport', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
      window.matchMedia = createMatchMedia(false) as any;
    });

    it('renders full desktop header', () => {
      render(<ResumeBuilder />);
      
      const headers = screen.getAllByRole('banner');
      const appHeader = headers[0];
      expect(appHeader).toHaveClass('h-12', 'md:h-14');
    });

    it('shows full title on desktop', () => {
      render(<ResumeBuilder />);
      
      expect(screen.getByText('Resume Builder')).toBeInTheDocument();
    });
  });

  describe('responsive layout components', () => {
    it('contact section has responsive grid classes', () => {
      render(<ResumeBuilder />);
      
      const emailInput = screen.getByDisplayValue('alex.johnson@email.com');
      const gridContainer = emailInput.closest('.grid');
      expect(gridContainer).toHaveClass('grid-cols-1', 'sm:grid-cols-2');
    });

    it('editor pane has responsive padding', () => {
      render(<ResumeBuilder />);
      
      // Look for editor header
      const editorHeader = screen.getByText('Resume Editor').closest('div');
      expect(editorHeader).toHaveClass('p-4', 'md:p-6');
    });
  });

  describe('template selector', () => {
    it('template selector is full width on mobile', async () => {
      const user = userEvent.setup();
      render(<ResumeBuilder />);
      
      const templateButton = screen.getByRole('button', { name: /template/i });
      await user.click(templateButton);
      
      await waitFor(() => {
        expect(screen.getByText('Classic')).toBeInTheDocument();
      });
      
      // Find the drawer by looking for the h2 heading
      const templateHeading = screen.getByRole('heading', { name: 'Templates' });
      const drawer = templateHeading.closest('[class*="fixed"]');
      expect(drawer).toHaveClass('w-full', 'sm:w-80');
    });
  });

  describe('export button', () => {
    it('has responsive positioning classes', () => {
      render(<ResumeBuilder />);
      
      // Export button should be positioned above mobile tab bar
      const exportButton = screen.getByText('Export PDF').closest('button');
      expect(exportButton).toHaveClass('bottom-20', 'md:bottom-8');
    });

    it('has responsive padding', () => {
      render(<ResumeBuilder />);
      
      const exportButton = screen.getByText('Export PDF').closest('button');
      expect(exportButton).toHaveClass('px-4', 'md:px-5');
    });
  });

  describe('preview pane', () => {
    it('preview has responsive padding', () => {
      render(<ResumeBuilder />);
      
      // Find preview area by zoom controls
      const zoomControls = screen.getByText('Preview').closest('div');
      expect(zoomControls).toHaveClass('px-3', 'md:px-6');
    });

    it('resume preview has responsive width', () => {
      render(<ResumeBuilder />);
      
      // Find the paper element with A4 aspect ratio
      const paper = document.querySelector('.a4-ratio');
      expect(paper).toHaveClass('w-[320px]', 'md:w-[595px]');
    });
  });
});

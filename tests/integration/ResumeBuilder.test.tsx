import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResumeBuilder } from '@/components/resume-builder/ResumeBuilder';

describe('ResumeBuilder', () => {
  beforeEach(() => {
    // Mock window.print
    vi.spyOn(window, 'print').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('rendering', () => {
    it('renders the resume builder', () => {
      render(<ResumeBuilder />);
      
      expect(screen.getByText('Resume Builder')).toBeInTheDocument();
    });

    it('renders header with logo', () => {
      render(<ResumeBuilder />);
      
      expect(screen.getByText('R')).toBeInTheDocument();
    });

    it('renders tagline', () => {
      render(<ResumeBuilder />);
      
      expect(screen.getByText('Swiss precision, zero clutter')).toBeInTheDocument();
    });

    it('renders templates button', () => {
      render(<ResumeBuilder />);
      
      expect(screen.getByText('Templates')).toBeInTheDocument();
    });

    it('renders export button', () => {
      render(<ResumeBuilder />);
      
      expect(screen.getByText('Export PDF')).toBeInTheDocument();
    });

    it('renders with ResumeProvider context', () => {
      render(<ResumeBuilder />);
      
      // Default data should be loaded
      expect(screen.getByDisplayValue('Alex Johnson')).toBeInTheDocument();
    });
  });

  describe('template selector', () => {
    it('opens template selector when button clicked', async () => {
      const user = userEvent.setup();
      render(<ResumeBuilder />);
      
      const templatesButton = screen.getByText('Templates');
      await user.click(templatesButton);
      
      // Wait for drawer to appear
      await waitFor(() => {
        expect(screen.getAllByText('Templates').length).toBeGreaterThan(1);
      });
    });

    it('displays template options when opened', async () => {
      const user = userEvent.setup();
      render(<ResumeBuilder />);
      
      await user.click(screen.getByText('Templates'));
      
      await waitFor(() => {
        expect(screen.getByText('Classic')).toBeInTheDocument();
        expect(screen.getByText('Modern')).toBeInTheDocument();
        expect(screen.getByText('Minimal')).toBeInTheDocument();
        expect(screen.getByText('Two Column')).toBeInTheDocument();
      });
    });

    it('closes template selector when template selected', async () => {
      const user = userEvent.setup();
      render(<ResumeBuilder />);
      
      await user.click(screen.getByText('Templates'));
      
      await waitFor(() => {
        expect(screen.getByText('Modern')).toBeInTheDocument();
      });
      
      const modernButton = screen.getByText('Modern').closest('button');
      await user.click(modernButton!);
      
      // Template selector should close
      await waitFor(() => {
        expect(screen.queryByText('Traditional centered layout')).not.toBeInTheDocument();
      });
    });
  });

  describe('editor pane', () => {
    it('renders contact section in editor', () => {
      render(<ResumeBuilder />);
      
      // Default contact name should be present
      expect(screen.getByDisplayValue('Alex Johnson')).toBeInTheDocument();
    });

    it('allows editing contact information', async () => {
      const user = userEvent.setup();
      render(<ResumeBuilder />);
      
      const nameInput = screen.getByDisplayValue('Alex Johnson');
      await user.clear(nameInput);
      await user.type(nameInput, 'John Smith');
      
      expect(screen.getByDisplayValue('John Smith')).toBeInTheDocument();
    });

    it('renders summary section', () => {
      render(<ResumeBuilder />);
      
      // Look for summary content
      expect(screen.getByDisplayValue(/Product designer with 8\+ years/)).toBeInTheDocument();
    });
  });

  describe('layout', () => {
    it('renders split pane layout', () => {
      const { container } = render(<ResumeBuilder />);
      
      // Should have resizable panels
      expect(container.querySelector('[data-panel]')).toBeInTheDocument();
    });

    it('has full screen dimensions', () => {
      const { container } = render(<ResumeBuilder />);
      
      const mainDiv = container.firstChild;
      expect(mainDiv).toHaveClass('h-screen', 'w-screen');
    });

    it('has correct background color', () => {
      const { container } = render(<ResumeBuilder />);
      
      const mainDiv = container.firstChild;
      expect(mainDiv).toHaveClass('bg-[#FAFAF9]');
    });
  });

  describe('header', () => {
    it('has border styling', () => {
      render(<ResumeBuilder />);
      
      // Multiple banners exist (app header and resume header)
      const headers = screen.getAllByRole('banner');
      const appHeader = headers[0];
      expect(appHeader).toHaveClass('border-b');
    });

    it('has fixed height', () => {
      render(<ResumeBuilder />);
      
      // Multiple banners exist (app header and resume header)
      const headers = screen.getAllByRole('banner');
      const appHeader = headers[0];
      expect(appHeader).toHaveClass('h-14');
    });
  });

  describe('print styles', () => {
    it('includes print media styles', () => {
      const { container } = render(<ResumeBuilder />);
      
      const styleTag = container.querySelector('style');
      expect(styleTag).toBeInTheDocument();
      expect(styleTag?.textContent).toContain('@media print');
    });
  });

  describe('integration', () => {
    it('updates preview when editor content changes', async () => {
      const user = userEvent.setup();
      render(<ResumeBuilder />);
      
      const nameInput = screen.getByDisplayValue('Alex Johnson');
      await user.clear(nameInput);
      await user.type(nameInput, 'Test User');
      
      // The name should appear in both editor and preview
      const testUserElements = screen.getAllByText('Test User');
      expect(testUserElements.length).toBeGreaterThanOrEqual(1);
    });

    it('skills section has input', async () => {
      render(<ResumeBuilder />);
      
      // Find skill input
      const skillInputs = screen.getAllByPlaceholderText('Add a skill...');
      expect(skillInputs.length).toBeGreaterThan(0);
    });
  });
});

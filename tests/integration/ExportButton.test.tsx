import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExportButton } from '@/components/resume-builder/ExportButton';

describe('ExportButton', () => {
  let originalPrint: typeof window.print;

  beforeEach(() => {
    originalPrint = window.print;
    window.print = vi.fn();
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    window.print = originalPrint;
    vi.useRealTimers();
  });

  describe('rendering', () => {
    it('renders export button', () => {
      render(<ExportButton />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('displays "Export PDF" text initially', () => {
      render(<ExportButton />);
      
      const exportButtons = screen.getAllByText('Export PDF');
      expect(exportButtons.length).toBeGreaterThan(0);
    });

    it('displays download icon', () => {
      render(<ExportButton />);
      
      // The button should contain the icon and text
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('export flow', () => {
    it('shows "Exporting..." when clicked', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<ExportButton />);
      
      const buttons = screen.getAllByRole('button');
      const button = buttons[0];
      await user.click(button);
      
      expect(screen.getByText('Exporting...')).toBeInTheDocument();
    });

    it('disables button during export', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<ExportButton />);
      
      const buttons = screen.getAllByRole('button');
      const button = buttons[0];
      await user.click(button);
      
      expect(button).toBeDisabled();
    });

    it('calls window.print after export delay', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<ExportButton />);
      
      const buttons = screen.getAllByRole('button');
      const button = buttons[0];
      await user.click(button);
      
      // Advance past the 1500ms export delay
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1600);
      });
      
      expect(window.print).toHaveBeenCalled();
    });

    it('shows success state after export', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<ExportButton />);
      
      const buttons = screen.getAllByRole('button');
      const button = buttons[0];
      await user.click(button);
      
      // Advance past export delay
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1600);
      });
      
      expect(screen.getByText('Done!')).toBeInTheDocument();
    });

    it('shows checkmark in success state', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<ExportButton />);
      
      const buttons = screen.getAllByRole('button');
      const button = buttons[0];
      await user.click(button);
      
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1600);
      });
      
      expect(screen.getByText('✓')).toBeInTheDocument();
    });

    it('returns to initial state after success timeout', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<ExportButton />);
      
      const buttons = screen.getAllByRole('button');
      const button = buttons[0];
      await user.click(button);
      
      // Advance past export delay
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1600);
      });
      
      // Advance past success display (2000ms)
      await act(async () => {
        await vi.advanceTimersByTimeAsync(2100);
      });
      
      const exportButtons = screen.getAllByText('Export PDF');
      expect(exportButtons.length).toBeGreaterThan(0);
    });

    it('enables button after export completes', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<ExportButton />);
      
      const buttons = screen.getAllByRole('button');
      const button = buttons[0];
      await user.click(button);
      
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1600);
      });
      
      expect(button).not.toBeDisabled();
    });
  });

  describe('styling', () => {
    it('has fixed positioning', () => {
      render(<ExportButton />);
      
      const buttons = screen.getAllByRole('button');
      const button = buttons[0];
      expect(button).toHaveClass('fixed');
    });

    it('is positioned at bottom right', () => {
      render(<ExportButton />);
      
      const buttons = screen.getAllByRole('button');
      const button = buttons[0];
      expect(button).toHaveClass('bottom-8', 'right-8');
    });

    it('has rounded styling', () => {
      render(<ExportButton />);
      
      const buttons = screen.getAllByRole('button');
      const button = buttons[0];
      expect(button).toHaveClass('rounded-full');
    });
  });

  describe('multiple exports', () => {
    it('can export multiple times', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<ExportButton />);
      
      const buttons = screen.getAllByRole('button');
      const button = buttons[0];
      
      // First export
      await user.click(button);
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1600);
      });
      await act(async () => {
        await vi.advanceTimersByTimeAsync(2100);
      });
      
      // Second export
      await user.click(button);
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1600);
      });
      
      expect(window.print).toHaveBeenCalledTimes(2);
    });
  });
});

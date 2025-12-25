import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SummarySection } from '@/components/resume-builder/sections/SummarySection';
import { ResumeProvider } from '@/contexts/ResumeContext';

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <ResumeProvider>
      {component}
    </ResumeProvider>
  );
};

describe('SummarySection', () => {
  describe('rendering', () => {
    it('renders a textarea for summary', () => {
      renderWithProvider(<SummarySection />);
      
      const textarea = screen.getByRole('textbox');
      expect(textarea.tagName.toLowerCase()).toBe('textarea');
    });

    it('displays default summary value', () => {
      renderWithProvider(<SummarySection />);
      
      expect(screen.getByDisplayValue(/Product designer with 8\+ years/)).toBeInTheDocument();
    });

    it('shows character counter', () => {
      renderWithProvider(<SummarySection />);
      
      // The counter shows current/max format
      expect(screen.getByText(/\/500/)).toBeInTheDocument();
    });
  });

  describe('user interactions', () => {
    it('updates summary when typing', async () => {
      const user = userEvent.setup();
      renderWithProvider(<SummarySection />);
      
      const textarea = screen.getByRole('textbox');
      await user.clear(textarea);
      await user.type(textarea, 'New summary text');
      
      expect(screen.getByDisplayValue('New summary text')).toBeInTheDocument();
    });

    it('allows clearing the summary', async () => {
      const user = userEvent.setup();
      renderWithProvider(<SummarySection />);
      
      const textarea = screen.getByRole('textbox');
      await user.clear(textarea);
      
      expect(textarea).toHaveValue('');
    });
  });

  describe('character counter', () => {
    it('shows character count for current text', () => {
      renderWithProvider(<SummarySection />);
      
      // Default text has a certain length
      const counter = screen.getByText(/\d+\/500/);
      expect(counter).toBeInTheDocument();
    });

    it('updates counter as user types', async () => {
      const user = userEvent.setup();
      renderWithProvider(<SummarySection />);
      
      const textarea = screen.getByRole('textbox');
      await user.clear(textarea);
      await user.type(textarea, 'Short');
      
      // Counter should show 5 characters
      expect(screen.getByText('5/500')).toBeInTheDocument();
    });

    it('shows warning state when approaching limit', () => {
      renderWithProvider(<SummarySection />);
      
      const textarea = screen.getByRole('textbox');
      
      // Set value directly with fireEvent for long text (much faster than userEvent.type)
      const longText = 'A'.repeat(420);
      fireEvent.change(textarea, { target: { value: longText } });
      
      // Counter should have warning class
      const counter = screen.getByText('420/500');
      expect(counter).toHaveClass('text-amber-500');
    });

    it('shows error state when exceeding limit', () => {
      renderWithProvider(<SummarySection />);
      
      const textarea = screen.getByRole('textbox');
      
      // Set value directly with fireEvent for long text
      const longText = 'A'.repeat(510);
      fireEvent.change(textarea, { target: { value: longText } });
      
      // Counter should have error class
      const counter = screen.getByText('510/500');
      expect(counter).toHaveClass('text-red-500');
    });

    it('shows warning message when approaching limit', () => {
      renderWithProvider(<SummarySection />);
      
      const textarea = screen.getByRole('textbox');
      
      const longText = 'A'.repeat(420);
      fireEvent.change(textarea, { target: { value: longText } });
      
      expect(screen.getByText(/getting long/i)).toBeInTheDocument();
    });

    it('shows error message when exceeding limit', () => {
      renderWithProvider(<SummarySection />);
      
      const textarea = screen.getByRole('textbox');
      
      const longText = 'A'.repeat(510);
      fireEvent.change(textarea, { target: { value: longText } });
      
      expect(screen.getByText(/too long/i)).toBeInTheDocument();
    });
  });

  describe('label behavior', () => {
    it('shows label when summary is empty', async () => {
      const user = userEvent.setup();
      renderWithProvider(<SummarySection />);
      
      const textarea = screen.getByRole('textbox');
      await user.clear(textarea);
      await user.tab(); // blur
      
      expect(screen.getByText('Professional Summary')).toBeInTheDocument();
    });

    it('hides label when summary has value', () => {
      renderWithProvider(<SummarySection />);
      
      // Default has value, so label should be hidden
      expect(screen.queryByText('Professional Summary')).not.toBeInTheDocument();
    });
  });
});

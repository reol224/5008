import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PublicationsSection } from '@/components/resume-builder/sections/PublicationsSection';
import { ResumeProvider } from '@/contexts/ResumeContext';

function renderWithProvider(ui: React.ReactElement) {
  return render(
    <ResumeProvider>
      {ui}
    </ResumeProvider>
  );
}

describe('PublicationsSection', () => {
  describe('rendering', () => {
    it('renders add publication button', () => {
      renderWithProvider(<PublicationsSection />);
      
      expect(screen.getByText('Add Publication')).toBeInTheDocument();
    });

    it('renders empty state initially', () => {
      renderWithProvider(<PublicationsSection />);
      
      expect(screen.queryByPlaceholderText('Publication Title')).not.toBeInTheDocument();
    });
  });

  describe('adding publications', () => {
    it('adds new publication when button clicked', async () => {
      const user = userEvent.setup();
      renderWithProvider(<PublicationsSection />);
      
      const addButton = screen.getByText('Add Publication');
      await user.click(addButton);
      
      expect(screen.getByPlaceholderText('Publication Title')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Publisher / Journal')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Publication Date')).toBeInTheDocument();
    });

    it('adds multiple publications', async () => {
      const user = userEvent.setup();
      renderWithProvider(<PublicationsSection />);
      
      const addButton = screen.getByText('Add Publication');
      await user.click(addButton);
      await user.click(addButton);
      
      const titleInputs = screen.getAllByPlaceholderText('Publication Title');
      expect(titleInputs).toHaveLength(2);
    });
  });

  describe('editing publications', () => {
    it('updates publication title', async () => {
      const user = userEvent.setup();
      renderWithProvider(<PublicationsSection />);
      
      await user.click(screen.getByText('Add Publication'));
      
      const titleInput = screen.getByPlaceholderText('Publication Title');
      await user.type(titleInput, 'Machine Learning in Practice');
      
      expect(titleInput).toHaveValue('Machine Learning in Practice');
    });

    it('updates publisher field', async () => {
      const user = userEvent.setup();
      renderWithProvider(<PublicationsSection />);
      
      await user.click(screen.getByText('Add Publication'));
      
      const publisherInput = screen.getByPlaceholderText('Publisher / Journal');
      await user.type(publisherInput, 'IEEE Transactions');
      
      expect(publisherInput).toHaveValue('IEEE Transactions');
    });

    it('updates optional URL', async () => {
      const user = userEvent.setup();
      renderWithProvider(<PublicationsSection />);
      
      await user.click(screen.getByText('Add Publication'));
      
      const urlInput = screen.getByPlaceholderText('URL (optional)');
      await user.type(urlInput, 'https://example.com/paper');
      
      expect(urlInput).toHaveValue('https://example.com/paper');
    });

    it('updates optional description', async () => {
      const user = userEvent.setup();
      renderWithProvider(<PublicationsSection />);
      
      await user.click(screen.getByText('Add Publication'));
      
      const descInput = screen.getByPlaceholderText('Brief description (optional)');
      await user.type(descInput, 'A paper about ML techniques');
      
      expect(descInput).toHaveValue('A paper about ML techniques');
    });
  });

  describe('removing publications', () => {
    it('removes publication when delete button clicked', async () => {
      const user = userEvent.setup();
      renderWithProvider(<PublicationsSection />);
      
      await user.click(screen.getByText('Add Publication'));
      const titleInput = screen.getByPlaceholderText('Publication Title');
      await user.type(titleInput, 'Test Publication');
      
      const deleteButtons = screen.getAllByRole('button');
      const deleteButton = deleteButtons.find(btn => btn.querySelector('svg.lucide-x'));
      expect(deleteButton).toBeDefined();
      
      await user.click(deleteButton!);
      
      await waitFor(() => {
        expect(screen.queryByDisplayValue('Test Publication')).not.toBeInTheDocument();
      });
    });
  });

  describe('form fields', () => {
    it('has all required and optional fields', async () => {
      const user = userEvent.setup();
      renderWithProvider(<PublicationsSection />);
      
      await user.click(screen.getByText('Add Publication'));
      
      // Required fields
      expect(screen.getByPlaceholderText('Publication Title')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Publisher / Journal')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Publication Date')).toBeInTheDocument();
      
      // Optional fields
      expect(screen.getByPlaceholderText('URL (optional)')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Brief description (optional)')).toBeInTheDocument();
    });
  });
});

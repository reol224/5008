import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AwardsSection } from '@/components/resume-builder/sections/AwardsSection';
import { ResumeProvider } from '@/contexts/ResumeContext';

function renderWithProvider(ui: React.ReactElement) {
  return render(
    <ResumeProvider>
      {ui}
    </ResumeProvider>
  );
}

describe('AwardsSection', () => {
  describe('rendering', () => {
    it('renders add award button', () => {
      renderWithProvider(<AwardsSection />);
      
      expect(screen.getByText('Add Award')).toBeInTheDocument();
    });

    it('renders empty state initially', () => {
      renderWithProvider(<AwardsSection />);
      
      expect(screen.queryByPlaceholderText('Award Title')).not.toBeInTheDocument();
    });
  });

  describe('adding awards', () => {
    it('adds new award when button clicked', async () => {
      const user = userEvent.setup();
      renderWithProvider(<AwardsSection />);
      
      const addButton = screen.getByText('Add Award');
      await user.click(addButton);
      
      expect(screen.getByPlaceholderText('Award Title')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Issuing Organization')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Date Received')).toBeInTheDocument();
    });

    it('adds multiple awards', async () => {
      const user = userEvent.setup();
      renderWithProvider(<AwardsSection />);
      
      const addButton = screen.getByText('Add Award');
      await user.click(addButton);
      await user.click(addButton);
      
      const titleInputs = screen.getAllByPlaceholderText('Award Title');
      expect(titleInputs).toHaveLength(2);
    });
  });

  describe('editing awards', () => {
    it('updates award title', async () => {
      const user = userEvent.setup();
      renderWithProvider(<AwardsSection />);
      
      await user.click(screen.getByText('Add Award'));
      
      const titleInput = screen.getByPlaceholderText('Award Title');
      await user.type(titleInput, 'Employee of the Year');
      
      expect(titleInput).toHaveValue('Employee of the Year');
    });

    it('updates issuer field', async () => {
      const user = userEvent.setup();
      renderWithProvider(<AwardsSection />);
      
      await user.click(screen.getByText('Add Award'));
      
      const issuerInput = screen.getByPlaceholderText('Issuing Organization');
      await user.type(issuerInput, 'TechCorp Inc.');
      
      expect(issuerInput).toHaveValue('TechCorp Inc.');
    });

    it('updates date received', async () => {
      const user = userEvent.setup();
      renderWithProvider(<AwardsSection />);
      
      await user.click(screen.getByText('Add Award'));
      
      const dateInput = screen.getByPlaceholderText('Date Received');
      await user.type(dateInput, '2023');
      
      expect(dateInput).toHaveValue('2023');
    });

    it('updates optional description', async () => {
      const user = userEvent.setup();
      renderWithProvider(<AwardsSection />);
      
      await user.click(screen.getByText('Add Award'));
      
      const descInput = screen.getByPlaceholderText('Description (optional)');
      await user.type(descInput, 'Awarded for outstanding performance');
      
      expect(descInput).toHaveValue('Awarded for outstanding performance');
    });
  });

  describe('removing awards', () => {
    it('removes award when delete button clicked', async () => {
      const user = userEvent.setup();
      renderWithProvider(<AwardsSection />);
      
      await user.click(screen.getByText('Add Award'));
      const titleInput = screen.getByPlaceholderText('Award Title');
      await user.type(titleInput, 'Test Award');
      
      const deleteButtons = screen.getAllByRole('button');
      const deleteButton = deleteButtons.find(btn => btn.querySelector('svg.lucide-x'));
      expect(deleteButton).toBeDefined();
      
      await user.click(deleteButton!);
      
      await waitFor(() => {
        expect(screen.queryByDisplayValue('Test Award')).not.toBeInTheDocument();
      });
    });
  });

  describe('form fields', () => {
    it('has all required and optional fields', async () => {
      const user = userEvent.setup();
      renderWithProvider(<AwardsSection />);
      
      await user.click(screen.getByText('Add Award'));
      
      // Required fields
      expect(screen.getByPlaceholderText('Award Title')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Issuing Organization')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Date Received')).toBeInTheDocument();
      
      // Optional fields
      expect(screen.getByPlaceholderText('Description (optional)')).toBeInTheDocument();
    });
  });
});

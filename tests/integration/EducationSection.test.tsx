import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EducationSection } from '@/components/resume-builder/sections/EducationSection';
import { ResumeProvider } from '@/contexts/ResumeContext';

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <ResumeProvider>
      {component}
    </ResumeProvider>
  );
};

describe('EducationSection', () => {
  describe('rendering', () => {
    it('renders education entry with all fields', () => {
      renderWithProvider(<EducationSection />);
      
      // Institution
      expect(screen.getByDisplayValue('University of California, Berkeley')).toBeInTheDocument();
      // Degree
      expect(screen.getByDisplayValue('Bachelor of Arts')).toBeInTheDocument();
      // Field of study
      expect(screen.getByDisplayValue('Cognitive Science')).toBeInTheDocument();
      // Date range
      expect(screen.getByDisplayValue('2010')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2014')).toBeInTheDocument();
      // GPA
      expect(screen.getByDisplayValue('3.8')).toBeInTheDocument();
    });

    it('renders add education button', () => {
      renderWithProvider(<EducationSection />);
      
      expect(screen.getByText('Add Education')).toBeInTheDocument();
    });
  });

  describe('adding education', () => {
    it('adds new education when button clicked', async () => {
      const user = userEvent.setup();
      renderWithProvider(<EducationSection />);
      
      const initialInputs = screen.getAllByRole('textbox');
      const initialCount = initialInputs.length;
      
      const addButton = screen.getByText('Add Education');
      await user.click(addButton);
      
      // Should have added a new education entry with more inputs
      const inputs = screen.getAllByRole('textbox');
      expect(inputs.length).toBeGreaterThan(initialCount);
    });
  });

  describe('editing education', () => {
    it('updates institution name', async () => {
      const user = userEvent.setup();
      renderWithProvider(<EducationSection />);
      
      const institutionInput = screen.getByDisplayValue('University of California, Berkeley');
      await user.clear(institutionInput);
      await user.type(institutionInput, 'MIT');
      
      expect(screen.getByDisplayValue('MIT')).toBeInTheDocument();
    });

    it('updates degree', async () => {
      const user = userEvent.setup();
      renderWithProvider(<EducationSection />);
      
      const degreeInput = screen.getByDisplayValue('Bachelor of Arts');
      await user.clear(degreeInput);
      await user.type(degreeInput, 'Master of Science');
      
      expect(screen.getByDisplayValue('Master of Science')).toBeInTheDocument();
    });

    it('updates field of study', async () => {
      const user = userEvent.setup();
      renderWithProvider(<EducationSection />);
      
      const fieldInput = screen.getByDisplayValue('Cognitive Science');
      await user.clear(fieldInput);
      await user.type(fieldInput, 'Computer Science');
      
      expect(screen.getByDisplayValue('Computer Science')).toBeInTheDocument();
    });

    it('updates start date', async () => {
      const user = userEvent.setup();
      renderWithProvider(<EducationSection />);
      
      const startDateInput = screen.getByDisplayValue('2010');
      await user.clear(startDateInput);
      await user.type(startDateInput, '2015');
      
      expect(screen.getByDisplayValue('2015')).toBeInTheDocument();
    });

    it('updates end date', async () => {
      const user = userEvent.setup();
      renderWithProvider(<EducationSection />);
      
      const endDateInput = screen.getByDisplayValue('2014');
      await user.clear(endDateInput);
      await user.type(endDateInput, '2019');
      
      expect(screen.getByDisplayValue('2019')).toBeInTheDocument();
    });

    it('updates GPA', async () => {
      const user = userEvent.setup();
      renderWithProvider(<EducationSection />);
      
      const gpaInput = screen.getByDisplayValue('3.8');
      await user.clear(gpaInput);
      await user.type(gpaInput, '4.0');
      
      expect(screen.getByDisplayValue('4.0')).toBeInTheDocument();
    });
  });

  describe('removing education', () => {
    it('removes education when delete clicked', async () => {
      const user = userEvent.setup();
      renderWithProvider(<EducationSection />);
      
      // Verify initial state
      expect(screen.getByDisplayValue('University of California, Berkeley')).toBeInTheDocument();
      
      // Count initial buttons
      const initialButtons = screen.getAllByRole('button');
      const initialButtonCount = initialButtons.length;
      
      // Find remove buttons (filter for delete/remove buttons)
      const removeButtons = initialButtons.filter(btn => 
        btn.classList.contains('hover:text-destructive') ||
        btn.getAttribute('aria-label')?.includes('remove') ||
        btn.querySelector('svg')
      );
      
      // Click the first remove button (should remove the first education entry)
      await user.click(removeButtons[0]);
      
      // Assert the education entry is removed
      await waitFor(() => {
        expect(screen.queryByDisplayValue('University of California, Berkeley')).not.toBeInTheDocument();
      });
      
      // Verify button count decreased
      const remainingButtons = screen.getAllByRole('button');
      expect(remainingButtons.length).toBeLessThan(initialButtonCount);
    });
  });

  describe('empty state', () => {
    it('displays add button when no education exists', async () => {
      const user = userEvent.setup();
      renderWithProvider(<EducationSection />);
      
      // Verify initial education entry exists
      expect(screen.getByDisplayValue('University of California, Berkeley')).toBeInTheDocument();
      
      // Find and click all remove buttons to clear education entries
      let removeButtons = screen.getAllByRole('button').filter(btn => 
        btn.classList.contains('hover:text-destructive') ||
        btn.getAttribute('aria-label')?.includes('remove') ||
        btn.querySelector('svg')
      );
      
      // Remove all education entries by clicking remove buttons
      while (removeButtons.length > 1) { // Keep at least the Add button
        const removeBtn = removeButtons.find(btn => 
          !btn.textContent?.includes('Add')
        );
        if (!removeBtn) break;
        
        await user.click(removeBtn);
        
        // Wait for UI to update
        await waitFor(() => {
          const currentButtons = screen.getAllByRole('button');
          expect(currentButtons.length).toBeLessThan(removeButtons.length + 1);
        });
        
        // Refresh remove buttons list
        removeButtons = screen.getAllByRole('button').filter(btn => 
          btn.classList.contains('hover:text-destructive') ||
          btn.getAttribute('aria-label')?.includes('remove') ||
          btn.querySelector('svg')
        );
      }
      
      // Verify education entry was removed
      await waitFor(() => {
        expect(screen.queryByDisplayValue('University of California, Berkeley')).not.toBeInTheDocument();
      });
      
      // Add button should still be present in empty state
      expect(screen.getByText('Add Education')).toBeInTheDocument();
    });
  });
});

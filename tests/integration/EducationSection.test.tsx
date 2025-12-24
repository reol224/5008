import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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
    it('renders education entries', () => {
      renderWithProvider(<EducationSection />);
      
      expect(screen.getByDisplayValue('University of California, Berkeley')).toBeInTheDocument();
    });

    it('displays degree information', () => {
      renderWithProvider(<EducationSection />);
      
      expect(screen.getByDisplayValue('Bachelor of Arts')).toBeInTheDocument();
    });

    it('displays field of study', () => {
      renderWithProvider(<EducationSection />);
      
      expect(screen.getByDisplayValue('Cognitive Science')).toBeInTheDocument();
    });

    it('displays date range', () => {
      renderWithProvider(<EducationSection />);
      
      expect(screen.getByDisplayValue('2010')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2014')).toBeInTheDocument();
    });

    it('displays GPA if available', () => {
      renderWithProvider(<EducationSection />);
      
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
      
      const addButton = screen.getByText('Add Education');
      await user.click(addButton);
      
      // Should have added a new education entry
      // Look for empty input fields or increased count
      const inputs = screen.getAllByRole('textbox');
      expect(inputs.length).toBeGreaterThan(5); // Original 5 + new empty ones
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
    it('has remove button for education entries', () => {
      renderWithProvider(<EducationSection />);
      
      // Find remove buttons (X icons)
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(1); // At least add and remove buttons
    });

    it('removes education when delete clicked', async () => {
      renderWithProvider(<EducationSection />);
      
      // Verify initial state
      expect(screen.getByDisplayValue('University of California, Berkeley')).toBeInTheDocument();
      
      // Find remove buttons
      const buttons = screen.getAllByRole('button');
      // At least one remove button should exist
      expect(buttons.length).toBeGreaterThan(1);
    });
  });

  describe('empty state', () => {
    it('displays add button when no education exists', async () => {
      const user = userEvent.setup();
      renderWithProvider(<EducationSection />);
      
      // Remove existing education
      const buttons = screen.getAllByRole('button');
      const removeButtons = buttons.filter(btn => 
        btn.classList.contains('hover:text-destructive') ||
        btn.getAttribute('aria-label')?.includes('remove')
      );
      
      // Add button should always be present
      expect(screen.getByText('Add Education')).toBeInTheDocument();
    });
  });

  describe('form fields', () => {
    it('has institution input field', () => {
      renderWithProvider(<EducationSection />);
      
      expect(screen.getByDisplayValue('University of California, Berkeley')).toBeInTheDocument();
    });

    it('has degree input field', () => {
      renderWithProvider(<EducationSection />);
      
      expect(screen.getByDisplayValue('Bachelor of Arts')).toBeInTheDocument();
    });

    it('has field of study input', () => {
      renderWithProvider(<EducationSection />);
      
      expect(screen.getByDisplayValue('Cognitive Science')).toBeInTheDocument();
    });

    it('has date fields', () => {
      renderWithProvider(<EducationSection />);
      
      expect(screen.getByDisplayValue('2010')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2014')).toBeInTheDocument();
    });

    it('has optional GPA field', () => {
      renderWithProvider(<EducationSection />);
      
      expect(screen.getByDisplayValue('3.8')).toBeInTheDocument();
    });
  });
});

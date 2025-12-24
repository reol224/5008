import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactSection } from '@/components/resume-builder/sections/ContactSection';
import { ResumeProvider } from '@/contexts/ResumeContext';

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <ResumeProvider>
      {component}
    </ResumeProvider>
  );
};

describe('ContactSection', () => {
  describe('rendering', () => {
    it('renders all contact input fields', () => {
      renderWithProvider(<ContactSection />);
      
      const inputs = screen.getAllByRole('textbox');
      expect(inputs.length).toBeGreaterThanOrEqual(5);
    });

    it('displays default contact values', () => {
      renderWithProvider(<ContactSection />);
      
      expect(screen.getByDisplayValue('Alex Johnson')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Senior Product Designer')).toBeInTheDocument();
    });

    it('displays email and phone fields', () => {
      renderWithProvider(<ContactSection />);
      
      expect(screen.getByDisplayValue('alex.johnson@email.com')).toBeInTheDocument();
      expect(screen.getByDisplayValue('(555) 123-4567')).toBeInTheDocument();
    });

    it('displays location field', () => {
      renderWithProvider(<ContactSection />);
      
      expect(screen.getByDisplayValue('San Francisco, CA')).toBeInTheDocument();
    });

    it('displays optional linkedin and website fields', () => {
      renderWithProvider(<ContactSection />);
      
      expect(screen.getByDisplayValue('linkedin.com/in/alexjohnson')).toBeInTheDocument();
      expect(screen.getByDisplayValue('alexjohnson.design')).toBeInTheDocument();
    });
  });

  describe('user interactions', () => {
    it('updates full name when typing', async () => {
      const user = userEvent.setup();
      renderWithProvider(<ContactSection />);
      
      const nameInput = screen.getByDisplayValue('Alex Johnson');
      await user.clear(nameInput);
      await user.type(nameInput, 'Jane Smith');
      
      expect(screen.getByDisplayValue('Jane Smith')).toBeInTheDocument();
    });

    it('updates title when typing', async () => {
      const user = userEvent.setup();
      renderWithProvider(<ContactSection />);
      
      const titleInput = screen.getByDisplayValue('Senior Product Designer');
      await user.clear(titleInput);
      await user.type(titleInput, 'Software Engineer');
      
      expect(screen.getByDisplayValue('Software Engineer')).toBeInTheDocument();
    });

    it('updates email when typing', async () => {
      const user = userEvent.setup();
      renderWithProvider(<ContactSection />);
      
      const emailInput = screen.getByDisplayValue('alex.johnson@email.com');
      await user.clear(emailInput);
      await user.type(emailInput, 'new@email.com');
      
      expect(screen.getByDisplayValue('new@email.com')).toBeInTheDocument();
    });

    it('updates phone when typing', async () => {
      const user = userEvent.setup();
      renderWithProvider(<ContactSection />);
      
      const phoneInput = screen.getByDisplayValue('(555) 123-4567');
      await user.clear(phoneInput);
      await user.type(phoneInput, '(555) 999-9999');
      
      expect(screen.getByDisplayValue('(555) 999-9999')).toBeInTheDocument();
    });

    it('updates location when typing', async () => {
      const user = userEvent.setup();
      renderWithProvider(<ContactSection />);
      
      const locationInput = screen.getByDisplayValue('San Francisco, CA');
      await user.clear(locationInput);
      await user.type(locationInput, 'New York, NY');
      
      expect(screen.getByDisplayValue('New York, NY')).toBeInTheDocument();
    });

    it('updates linkedin when typing', async () => {
      const user = userEvent.setup();
      renderWithProvider(<ContactSection />);
      
      const linkedinInput = screen.getByDisplayValue('linkedin.com/in/alexjohnson');
      await user.clear(linkedinInput);
      await user.type(linkedinInput, 'linkedin.com/in/janesmith');
      
      expect(screen.getByDisplayValue('linkedin.com/in/janesmith')).toBeInTheDocument();
    });

    it('updates website when typing', async () => {
      const user = userEvent.setup();
      renderWithProvider(<ContactSection />);
      
      const websiteInput = screen.getByDisplayValue('alexjohnson.design');
      await user.clear(websiteInput);
      await user.type(websiteInput, 'janesmith.dev');
      
      expect(screen.getByDisplayValue('janesmith.dev')).toBeInTheDocument();
    });
  });

  describe('field labels', () => {
    it('shows Full Name label when field is empty', async () => {
      const user = userEvent.setup();
      renderWithProvider(<ContactSection />);
      
      const nameInput = screen.getByDisplayValue('Alex Johnson');
      await user.clear(nameInput);
      await user.tab(); // blur
      
      expect(screen.getByText('Full Name')).toBeInTheDocument();
    });

    it('shows Professional Title label when field is empty', async () => {
      const user = userEvent.setup();
      renderWithProvider(<ContactSection />);
      
      const titleInput = screen.getByDisplayValue('Senior Product Designer');
      await user.clear(titleInput);
      await user.tab();
      
      expect(screen.getByText('Professional Title')).toBeInTheDocument();
    });

    it('shows Email label when field is empty', async () => {
      const user = userEvent.setup();
      renderWithProvider(<ContactSection />);
      
      const emailInput = screen.getByDisplayValue('alex.johnson@email.com');
      await user.clear(emailInput);
      await user.tab();
      
      expect(screen.getByText('Email')).toBeInTheDocument();
    });
  });

  describe('layout', () => {
    it('renders grid layout for email and phone', () => {
      renderWithProvider(<ContactSection />);
      
      const container = screen.getByDisplayValue('alex.johnson@email.com').closest('.grid');
      expect(container).toHaveClass('grid-cols-2');
    });

    it('renders grid layout for linkedin and website', () => {
      renderWithProvider(<ContactSection />);
      
      const container = screen.getByDisplayValue('linkedin.com/in/alexjohnson').closest('.grid');
      expect(container).toHaveClass('grid-cols-2');
    });
  });
});

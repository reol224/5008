import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CertificationsSection } from '@/components/resume-builder/sections/CertificationsSection';
import { ResumeProvider } from '@/contexts/ResumeContext';

function renderWithProvider(ui: React.ReactElement) {
  return render(
    <ResumeProvider>
      {ui}
    </ResumeProvider>
  );
}

describe('CertificationsSection', () => {
  describe('rendering', () => {
    it('renders add certification button', () => {
      renderWithProvider(<CertificationsSection />);
      
      expect(screen.getByText('Add Certification')).toBeInTheDocument();
    });

    it('renders empty state initially', () => {
      renderWithProvider(<CertificationsSection />);
      
      // No certification entries should exist initially
      expect(screen.queryByPlaceholderText('Certification Name')).not.toBeInTheDocument();
    });
  });

  describe('adding certifications', () => {
    it('adds new certification when button clicked', async () => {
      const user = userEvent.setup();
      renderWithProvider(<CertificationsSection />);
      
      const addButton = screen.getByText('Add Certification');
      await user.click(addButton);
      
      // Should have certification input fields now
      expect(screen.getByPlaceholderText('Certification Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Issuing Organization')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Issue Date')).toBeInTheDocument();
    });

    it('adds multiple certifications', async () => {
      const user = userEvent.setup();
      renderWithProvider(<CertificationsSection />);
      
      const addButton = screen.getByText('Add Certification');
      await user.click(addButton);
      await user.click(addButton);
      
      // Should have two certification name inputs
      const nameInputs = screen.getAllByPlaceholderText('Certification Name');
      expect(nameInputs).toHaveLength(2);
    });
  });

  describe('editing certifications', () => {
    it('updates certification name', async () => {
      const user = userEvent.setup();
      renderWithProvider(<CertificationsSection />);
      
      await user.click(screen.getByText('Add Certification'));
      
      const nameInput = screen.getByPlaceholderText('Certification Name');
      await user.type(nameInput, 'AWS Solutions Architect');
      
      expect(nameInput).toHaveValue('AWS Solutions Architect');
    });

    it('updates issuer field', async () => {
      const user = userEvent.setup();
      renderWithProvider(<CertificationsSection />);
      
      await user.click(screen.getByText('Add Certification'));
      
      const issuerInput = screen.getByPlaceholderText('Issuing Organization');
      await user.type(issuerInput, 'Amazon Web Services');
      
      expect(issuerInput).toHaveValue('Amazon Web Services');
    });

    it('updates optional expiry date', async () => {
      const user = userEvent.setup();
      renderWithProvider(<CertificationsSection />);
      
      await user.click(screen.getByText('Add Certification'));
      
      const expiryInput = screen.getByPlaceholderText('Expiry Date (optional)');
      await user.type(expiryInput, '2026');
      
      expect(expiryInput).toHaveValue('2026');
    });

    it('updates optional credential ID', async () => {
      const user = userEvent.setup();
      renderWithProvider(<CertificationsSection />);
      
      await user.click(screen.getByText('Add Certification'));
      
      const credentialInput = screen.getByPlaceholderText('Credential ID (optional)');
      await user.type(credentialInput, 'ABC123XYZ');
      
      expect(credentialInput).toHaveValue('ABC123XYZ');
    });
  });

  describe('removing certifications', () => {
    it('removes certification when delete button clicked', async () => {
      const user = userEvent.setup();
      renderWithProvider(<CertificationsSection />);
      
      // Add a certification
      await user.click(screen.getByText('Add Certification'));
      const nameInput = screen.getByPlaceholderText('Certification Name');
      await user.type(nameInput, 'Test Cert');
      
      // Find and click delete button
      const deleteButtons = screen.getAllByRole('button');
      const deleteButton = deleteButtons.find(btn => btn.querySelector('svg.lucide-x'));
      expect(deleteButton).toBeDefined();
      
      await user.click(deleteButton!);
      
      // Certification should be removed
      await waitFor(() => {
        expect(screen.queryByDisplayValue('Test Cert')).not.toBeInTheDocument();
      });
    });
  });

  describe('form fields', () => {
    it('has all required and optional fields', async () => {
      const user = userEvent.setup();
      renderWithProvider(<CertificationsSection />);
      
      await user.click(screen.getByText('Add Certification'));
      
      // Required fields
      expect(screen.getByPlaceholderText('Certification Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Issuing Organization')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Issue Date')).toBeInTheDocument();
      
      // Optional fields
      expect(screen.getByPlaceholderText('Expiry Date (optional)')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Credential ID (optional)')).toBeInTheDocument();
    });
  });
});

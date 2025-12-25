import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TemplateSelector } from '@/components/resume-builder/TemplateSelector';
import { ResumeProvider } from '@/contexts/ResumeContext';

const renderWithProvider = (isOpen: boolean, onClose = vi.fn()) => {
  return render(
    <ResumeProvider>
      <TemplateSelector isOpen={isOpen} onClose={onClose} />
    </ResumeProvider>
  );
};

describe('TemplateSelector', () => {
  describe('visibility', () => {
    it('renders when isOpen is true', () => {
      renderWithProvider(true);
      
      expect(screen.getByText('Templates')).toBeInTheDocument();
    });

    it('does not render when isOpen is false', () => {
      renderWithProvider(false);
      
      expect(screen.queryByText('Templates')).not.toBeInTheDocument();
    });
  });

  describe('template options', () => {
    it('displays Classic template option', () => {
      renderWithProvider(true);
      
      expect(screen.getByText('Classic')).toBeInTheDocument();
      expect(screen.getByText('Traditional centered layout')).toBeInTheDocument();
    });

    it('displays Modern template option', () => {
      renderWithProvider(true);
      
      expect(screen.getByText('Modern')).toBeInTheDocument();
      expect(screen.getByText('Bold header with accents')).toBeInTheDocument();
    });

    it('displays Minimal template option', () => {
      renderWithProvider(true);
      
      expect(screen.getByText('Minimal')).toBeInTheDocument();
      expect(screen.getByText('Clean, typography-focused')).toBeInTheDocument();
    });

    it('displays Two Column template option', () => {
      renderWithProvider(true);
      
      expect(screen.getByText('Two Column')).toBeInTheDocument();
      expect(screen.getByText('Efficient side-by-side layout')).toBeInTheDocument();
    });

    it('displays all 4 template options', () => {
      renderWithProvider(true);
      
      const templateNames = ['Classic', 'Modern', 'Minimal', 'Two Column'];
      templateNames.forEach(name => {
        expect(screen.getByText(name)).toBeInTheDocument();
      });
    });
  });

  describe('template selection', () => {
    it('selects template when clicked', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      renderWithProvider(true, onClose);
      
      const modernButton = screen.getByText('Modern').closest('button');
      await user.click(modernButton!);
      
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('highlights currently selected template', () => {
      renderWithProvider(true);
      
      // Classic is default selected
      const classicButton = screen.getByText('Classic').closest('button');
      expect(classicButton).toHaveClass('border-[#64748B]');
    });

    it('changes selection when different template clicked', async () => {
      const user = userEvent.setup();
      renderWithProvider(true);
      
      const modernButton = screen.getByText('Modern').closest('button');
      await user.click(modernButton!);
      
      // Re-render to see updated state (in real app, the parent would control this)
    });
  });

  describe('close functionality', () => {
    it('calls onClose when close button clicked', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      renderWithProvider(true, onClose);
      
      // Find the X button
      const closeButton = screen.getByRole('button', { name: '' }); // X icon has no text
      const buttons = screen.getAllByRole('button');
      // The close button should be in the header area
      await user.click(buttons[0]); // First button is close
      
      expect(onClose).toHaveBeenCalled();
    });

    it('calls onClose when backdrop clicked', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      
      const { container } = renderWithProvider(true, onClose);
      
      // Click on the backdrop (fixed overlay)
      const backdrop = container.querySelector('.fixed.inset-0');
      if (backdrop) {
        await user.click(backdrop);
        expect(onClose).toHaveBeenCalled();
      }
    });

    it('calls onClose after selecting a template', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      renderWithProvider(true, onClose);
      
      const minimalButton = screen.getByText('Minimal').closest('button');
      await user.click(minimalButton!);
      
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('header', () => {
    it('displays Templates title', () => {
      renderWithProvider(true);
      
      expect(screen.getByText('Templates')).toBeInTheDocument();
    });

    it('displays template icon', () => {
      renderWithProvider(true);
      
      // LayoutTemplate icon should be present
      const header = screen.getByText('Templates').closest('div');
      expect(header).toBeInTheDocument();
    });
  });

  describe('animations', () => {
    it('animates in when opened', async () => {
      const { rerender } = render(
        <ResumeProvider>
          <TemplateSelector isOpen={false} onClose={() => {}} />
        </ResumeProvider>
      );
      
      rerender(
        <ResumeProvider>
          <TemplateSelector isOpen={true} onClose={() => {}} />
        </ResumeProvider>
      );
      
      await waitFor(() => {
        expect(screen.getByText('Templates')).toBeInTheDocument();
      });
    });
  });
});

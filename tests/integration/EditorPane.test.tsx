import { describe, it, expect } from 'vitest';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EditorPane } from '@/components/resume-builder/EditorPane';
import { ResumeProvider } from '@/contexts/ResumeContext';

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <ResumeProvider>
      {component}
    </ResumeProvider>
  );
};

describe('EditorPane', () => {
  describe('rendering', () => {
    it('renders editor pane', () => {
      renderWithProvider(<EditorPane />);
      
      // Should have sections
      expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    it('displays all section headers', () => {
      renderWithProvider(<EditorPane />);
      
      expect(screen.getByText('Contact')).toBeInTheDocument();
      expect(screen.getByText('Summary')).toBeInTheDocument();
      expect(screen.getByText('Experience')).toBeInTheDocument();
      expect(screen.getByText('Education')).toBeInTheDocument();
      // Skills appears multiple times (header and category)
      expect(screen.getAllByText('Skills').length).toBeGreaterThan(0);
    });

    it('renders contact section content', () => {
      renderWithProvider(<EditorPane />);
      
      expect(screen.getByDisplayValue('Alex Johnson')).toBeInTheDocument();
    });

    it('renders summary section content', () => {
      renderWithProvider(<EditorPane />);
      
      expect(screen.getByDisplayValue(/Product designer with 8\+ years/)).toBeInTheDocument();
    });

    it('renders experience section content', () => {
      renderWithProvider(<EditorPane />);
      
      expect(screen.getByDisplayValue('TechCorp Inc.')).toBeInTheDocument();
    });

    it('renders skills section content', () => {
      renderWithProvider(<EditorPane />);
      
      expect(screen.getByText('Figma')).toBeInTheDocument();
    });
  });

  describe('section collapsibility', () => {
    it('can toggle section visibility', async () => {
      const user = userEvent.setup();
      renderWithProvider(<EditorPane />);
      
      // Find a collapsible section header button (the button contains the section title)
      const contactHeader = screen.getByText('Contact').closest('button');
      
      // Initially content should be visible
      expect(screen.getByDisplayValue('Alex Johnson')).toBeInTheDocument();
      
      // Click to collapse the section
      await user.click(contactHeader!);
      
      // Content should be hidden after collapsing (AnimatePresence removes from DOM)
      await waitFor(() => {
        expect(screen.queryByDisplayValue('Alex Johnson')).not.toBeInTheDocument();
      });
      
      // Click again to expand
      await user.click(contactHeader!);
      
      // Content should be visible again
      await waitFor(() => {
        expect(screen.getByDisplayValue('Alex Johnson')).toBeInTheDocument();
      });
    });
  });

  describe('editing', () => {
    it('allows editing contact name', async () => {
      const user = userEvent.setup();
      renderWithProvider(<EditorPane />);
      
      const nameInput = screen.getByDisplayValue('Alex Johnson');
      await user.clear(nameInput);
      await user.type(nameInput, 'New Name');
      
      expect(screen.getByDisplayValue('New Name')).toBeInTheDocument();
    });

    it('allows editing summary', async () => {
      const user = userEvent.setup();
      renderWithProvider(<EditorPane />);
      
      const summaryInput = screen.getByDisplayValue(/Product designer with 8\+ years/);
      await user.clear(summaryInput);
      await user.type(summaryInput, 'New summary');
      
      expect(screen.getByDisplayValue('New summary')).toBeInTheDocument();
    });

    it('allows adding skills', async () => {
      const user = userEvent.setup();
      renderWithProvider(<EditorPane />);
      
      const skillInput = screen.getByPlaceholderText('Add a skill...');
      await user.type(skillInput, 'Python{Enter}');
      
      expect(screen.getByText('Python')).toBeInTheDocument();
    });
  });

  describe('section order', () => {
    it('displays sections in correct order', () => {
      renderWithProvider(<EditorPane />);
      
      const allHeaders = screen.getAllByRole('button').filter(el => 
        ['Contact', 'Summary', 'Experience', 'Education', 'Skills'].includes(el.textContent?.trim() || '')
      );
      
      // Verify sections appear in default order
      const headerTexts = allHeaders.map(el => el.textContent?.trim());
      expect(headerTexts.slice(0, 5)).toEqual(['Contact', 'Summary', 'Experience', 'Education', 'Skills']);
    });
  });

  describe('styling', () => {
    it('has scrollable container', () => {
      const { container } = renderWithProvider(<EditorPane />);
      
      // Should have overflow handling
      const scrollContainer = container.querySelector('.overflow-y-auto');
      expect(scrollContainer).toBeInTheDocument();
    });

    it('has correct background', () => {
      const { container } = renderWithProvider(<EditorPane />);
      
      // Editor pane should have background gradient class
      const editorPane = container.firstChild as HTMLElement;
      expect(editorPane).toHaveClass('bg-gradient-to-b');
      expect(editorPane.className).toContain('from-[#FAFAF9]');
      expect(editorPane.className).toContain('to-[#F5F5F4]');
    });
  });

  describe('experience section', () => {
    it('displays experience entries', () => {
      renderWithProvider(<EditorPane />);
      
      expect(screen.getByDisplayValue('TechCorp Inc.')).toBeInTheDocument();
      expect(screen.getByDisplayValue('StartupXYZ')).toBeInTheDocument();
    });

    it('displays experience positions', () => {
      renderWithProvider(<EditorPane />);
      
      // May have multiple elements with same value
      const seniorPositions = screen.getAllByDisplayValue('Senior Product Designer');
      expect(seniorPositions.length).toBeGreaterThan(0);
    });
  });

  describe('education section', () => {
    it('displays education entries', () => {
      renderWithProvider(<EditorPane />);
      
      expect(screen.getByDisplayValue('University of California, Berkeley')).toBeInTheDocument();
    });

    it('displays degree information', () => {
      renderWithProvider(<EditorPane />);
      
      expect(screen.getByDisplayValue('Bachelor of Arts')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Cognitive Science')).toBeInTheDocument();
    });
  });
});

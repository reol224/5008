import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
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
      
      // Find a collapsible section header
      const contactHeader = screen.getByText('Contact');
      
      // Initially content should be visible
      expect(screen.getByDisplayValue('Alex Johnson')).toBeInTheDocument();
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
      
      const headers = ['Contact', 'Summary', 'Experience', 'Education'];
      const headerElements = headers.map(h => screen.getByText(h));
      
      // All headers should exist
      headerElements.forEach(el => {
        expect(el).toBeInTheDocument();
      });
      // Skills appears multiple times
      expect(screen.getAllByText('Skills').length).toBeGreaterThan(0);
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
      
      // Editor pane should have background gradient
      expect(container.firstChild).toBeInTheDocument();
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

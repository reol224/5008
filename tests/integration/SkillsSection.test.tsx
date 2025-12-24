import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SkillsSection } from '@/components/resume-builder/sections/SkillsSection';
import { ResumeProvider } from '@/contexts/ResumeContext';

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <ResumeProvider>
      {component}
    </ResumeProvider>
  );
};

describe('SkillsSection', () => {
  describe('rendering', () => {
    it('renders skill input field', () => {
      renderWithProvider(<SkillsSection />);
      
      expect(screen.getByPlaceholderText('Add a skill...')).toBeInTheDocument();
    });

    it('renders add button', () => {
      renderWithProvider(<SkillsSection />);
      
      const buttons = screen.getAllByRole('button');
      // At least one button should be the add button
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('displays default skills', () => {
      renderWithProvider(<SkillsSection />);
      
      expect(screen.getByText('Figma')).toBeInTheDocument();
      expect(screen.getByText('Sketch')).toBeInTheDocument();
      expect(screen.getByText('User Research')).toBeInTheDocument();
    });

    it('groups skills by category', () => {
      renderWithProvider(<SkillsSection />);
      
      expect(screen.getByText('Design Tools')).toBeInTheDocument();
      expect(screen.getByText('Skills')).toBeInTheDocument();
      expect(screen.getByText('Technical')).toBeInTheDocument();
    });
  });

  describe('adding skills', () => {
    it('adds a new skill when clicking add button', async () => {
      const user = userEvent.setup();
      renderWithProvider(<SkillsSection />);
      
      const input = screen.getByPlaceholderText('Add a skill...');
      await user.type(input, 'Python');
      
      // Find add button (Plus icon button)
      const addButtons = screen.getAllByRole('button');
      const addButton = addButtons.find(btn => !btn.classList.contains('opacity-0'));
      await user.click(addButton!);
      
      expect(screen.getByText('Python')).toBeInTheDocument();
    });

    it('adds a new skill when pressing Enter', async () => {
      const user = userEvent.setup();
      renderWithProvider(<SkillsSection />);
      
      const input = screen.getByPlaceholderText('Add a skill...');
      await user.type(input, 'Ruby{Enter}');
      
      expect(screen.getByText('Ruby')).toBeInTheDocument();
    });

    it('clears input after adding skill', async () => {
      const user = userEvent.setup();
      renderWithProvider(<SkillsSection />);
      
      const input = screen.getByPlaceholderText('Add a skill...');
      await user.type(input, 'Go{Enter}');
      
      expect(input).toHaveValue('');
    });

    it('does not add empty skill', async () => {
      const user = userEvent.setup();
      renderWithProvider(<SkillsSection />);
      
      const skillsBefore = screen.getAllByRole('button').length;
      
      const input = screen.getByPlaceholderText('Add a skill...');
      await user.type(input, '   {Enter}');
      
      const skillsAfter = screen.getAllByRole('button').length;
      expect(skillsAfter).toBe(skillsBefore);
    });

    it('trims whitespace from skill name', async () => {
      const user = userEvent.setup();
      renderWithProvider(<SkillsSection />);
      
      const input = screen.getByPlaceholderText('Add a skill...');
      await user.type(input, '  Rust  {Enter}');
      
      expect(screen.getByText('Rust')).toBeInTheDocument();
    });

    it('adds skill to Other category by default', async () => {
      const user = userEvent.setup();
      renderWithProvider(<SkillsSection />);
      
      const input = screen.getByPlaceholderText('Add a skill...');
      await user.type(input, 'New Skill{Enter}');
      
      expect(screen.getByText('Other')).toBeInTheDocument();
      expect(screen.getByText('New Skill')).toBeInTheDocument();
    });
  });

  describe('removing skills', () => {
    it('has remove button for each skill', async () => {
      renderWithProvider(<SkillsSection />);
      
      // Figma skill should be present
      expect(screen.getByText('Figma')).toBeInTheDocument();
      
      // Find the Figma skill container and its remove button
      const figmaSkill = screen.getByText('Figma').closest('span');
      const removeButton = within(figmaSkill!).getByRole('button');
      
      expect(removeButton).toBeInTheDocument();
    });

    it('each skill has a remove button', async () => {
      renderWithProvider(<SkillsSection />);
      
      // Both Figma and Sketch should have remove buttons
      const figmaSkill = screen.getByText('Figma').closest('span');
      const sketchSkill = screen.getByText('Sketch').closest('span');
      
      expect(within(figmaSkill!).getByRole('button')).toBeInTheDocument();
      expect(within(sketchSkill!).getByRole('button')).toBeInTheDocument();
    });
  });

  describe('skill categories', () => {
    it('displays Design Tools category', () => {
      renderWithProvider(<SkillsSection />);
      
      expect(screen.getByText('Design Tools')).toBeInTheDocument();
    });

    it('displays Skills category', () => {
      renderWithProvider(<SkillsSection />);
      
      expect(screen.getByText('Skills')).toBeInTheDocument();
    });

    it('displays Technical category', () => {
      renderWithProvider(<SkillsSection />);
      
      expect(screen.getByText('Technical')).toBeInTheDocument();
    });

    it('shows correct skills under Design Tools', () => {
      renderWithProvider(<SkillsSection />);
      
      expect(screen.getByText('Figma')).toBeInTheDocument();
      expect(screen.getByText('Sketch')).toBeInTheDocument();
      expect(screen.getByText('Adobe Creative Suite')).toBeInTheDocument();
    });

    it('shows correct skills under Technical', () => {
      renderWithProvider(<SkillsSection />);
      
      expect(screen.getByText('HTML/CSS')).toBeInTheDocument();
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
    });
  });

  describe('input focus', () => {
    it('focuses input when clicked', async () => {
      const user = userEvent.setup();
      renderWithProvider(<SkillsSection />);
      
      const input = screen.getByPlaceholderText('Add a skill...');
      await user.click(input);
      
      expect(input).toHaveFocus();
    });
  });
});

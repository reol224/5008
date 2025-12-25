import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CustomSectionEditor } from '@/components/resume-builder/sections/CustomSectionEditor';
import { ResumeProvider, useResume } from '@/contexts/ResumeContext';
import React from 'react';
import { CustomSection } from '@/types/resume';

// Wrapper that provides a custom section for testing
function CustomSectionTestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ResumeProvider>
      <CustomSectionSetup>{children}</CustomSectionSetup>
    </ResumeProvider>
  );
}

// Component that creates a custom section and renders children with it
function CustomSectionSetup({ children }: { children: React.ReactNode }) {
  const { addCustomSection, data } = useResume();
  const [initialized, setInitialized] = React.useState(false);

  React.useEffect(() => {
    if (!initialized) {
      addCustomSection('Projects');
      setInitialized(true);
    }
  }, [addCustomSection, initialized]);

  const customSection = data.customSections[0];
  
  if (!customSection) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<{ section: CustomSection }>, { section: customSection });
        }
        return child;
      })}
    </>
  );
}

function renderCustomSectionEditor() {
  return render(
    <CustomSectionTestWrapper>
      <CustomSectionEditor section={{ id: 'temp', title: 'temp', items: [] }} />
    </CustomSectionTestWrapper>
  );
}

describe('CustomSectionEditor', () => {
  describe('rendering', () => {
    it('renders with section title', async () => {
      renderCustomSectionEditor();
      
      await waitFor(() => {
        expect(screen.getByDisplayValue('Projects')).toBeInTheDocument();
      });
    });

    it('renders add item button', async () => {
      renderCustomSectionEditor();
      
      await waitFor(() => {
        expect(screen.getByText('Add Item')).toBeInTheDocument();
      });
    });

    it('renders delete section button', async () => {
      renderCustomSectionEditor();
      
      await waitFor(() => {
        expect(screen.getByDisplayValue('Projects')).toBeInTheDocument();
      });
      
      // Look for delete button by title attribute
      const deleteButton = screen.getByTitle('Remove Section');
      expect(deleteButton).toBeInTheDocument();
    });
  });

  describe('editing section title', () => {
    it('updates section title', async () => {
      const user = userEvent.setup();
      renderCustomSectionEditor();
      
      await waitFor(() => {
        expect(screen.getByDisplayValue('Projects')).toBeInTheDocument();
      });

      const titleInput = screen.getByDisplayValue('Projects');
      await user.clear(titleInput);
      await user.type(titleInput, 'Volunteer Work');
      
      expect(titleInput).toHaveValue('Volunteer Work');
    });
  });

  describe('adding items', () => {
    it('adds new item when button clicked', async () => {
      const user = userEvent.setup();
      renderCustomSectionEditor();
      
      await waitFor(() => {
        expect(screen.getByText('Add Item')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Add Item'));
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
      });
    });

    it('adds multiple items', async () => {
      const user = userEvent.setup();
      renderCustomSectionEditor();
      
      await waitFor(() => {
        expect(screen.getByText('Add Item')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Add Item'));
      await user.click(screen.getByText('Add Item'));
      
      await waitFor(() => {
        const titleInputs = screen.getAllByPlaceholderText('Title');
        expect(titleInputs).toHaveLength(2);
      });
    });
  });

  describe('editing items', () => {
    it('updates item title', async () => {
      const user = userEvent.setup();
      renderCustomSectionEditor();
      
      await waitFor(() => {
        expect(screen.getByText('Add Item')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Add Item'));
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
      });

      const titleInput = screen.getByPlaceholderText('Title');
      await user.type(titleInput, 'Project Alpha');
      
      expect(titleInput).toHaveValue('Project Alpha');
    });

    it('updates optional subtitle', async () => {
      const user = userEvent.setup();
      renderCustomSectionEditor();
      
      await waitFor(() => {
        expect(screen.getByText('Add Item')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Add Item'));
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Subtitle (optional)')).toBeInTheDocument();
      });

      const subtitleInput = screen.getByPlaceholderText('Subtitle (optional)');
      await user.type(subtitleInput, 'Lead Developer');
      
      expect(subtitleInput).toHaveValue('Lead Developer');
    });

    it('updates optional date', async () => {
      const user = userEvent.setup();
      renderCustomSectionEditor();
      
      await waitFor(() => {
        expect(screen.getByText('Add Item')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Add Item'));
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Date (optional)')).toBeInTheDocument();
      });

      const dateInput = screen.getByPlaceholderText('Date (optional)');
      await user.type(dateInput, '2023');
      
      expect(dateInput).toHaveValue('2023');
    });

    it('updates optional description', async () => {
      const user = userEvent.setup();
      renderCustomSectionEditor();
      
      await waitFor(() => {
        expect(screen.getByText('Add Item')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Add Item'));
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Description (optional)')).toBeInTheDocument();
      });

      const descInput = screen.getByPlaceholderText('Description (optional)');
      await user.type(descInput, 'A great project');
      
      expect(descInput).toHaveValue('A great project');
    });
  });

  describe('removing items', () => {
    it('removes item when delete button clicked', async () => {
      const user = userEvent.setup();
      renderCustomSectionEditor();
      
      await waitFor(() => {
        expect(screen.getByText('Add Item')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Add Item'));
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
      });

      const titleInput = screen.getByPlaceholderText('Title');
      await user.type(titleInput, 'Test Item');
      
      // Find delete button (X icon, not trash)
      const deleteButtons = screen.getAllByRole('button');
      const deleteButton = deleteButtons.find(btn => btn.querySelector('svg.lucide-x'));
      expect(deleteButton).toBeDefined();
      
      await user.click(deleteButton!);
      
      await waitFor(() => {
        expect(screen.queryByDisplayValue('Test Item')).not.toBeInTheDocument();
      });
    });
  });

  describe('form fields', () => {
    it('has all item fields', async () => {
      const user = userEvent.setup();
      renderCustomSectionEditor();
      
      await waitFor(() => {
        expect(screen.getByText('Add Item')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Add Item'));
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Subtitle (optional)')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Date (optional)')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Description (optional)')).toBeInTheDocument();
      });
    });
  });
});

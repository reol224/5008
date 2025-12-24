import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ResumeProvider, useResume } from '@/contexts/ResumeContext';
import type { ReactNode } from 'react';

const wrapper = ({ children }: { children: ReactNode }) => (
  <ResumeProvider>{children}</ResumeProvider>
);

describe('ResumeContext', () => {
  describe('initial state', () => {
    it('provides default resume data', () => {
      const { result } = renderHook(() => useResume(), { wrapper });
      
      expect(result.current.data).toBeDefined();
      expect(result.current.data.contact).toBeDefined();
      expect(result.current.data.contact.fullName).toBe('Alex Johnson');
    });

    it('provides default sections', () => {
      const { result } = renderHook(() => useResume(), { wrapper });
      
      expect(result.current.sections).toHaveLength(5);
      expect(result.current.sections[0].id).toBe('contact');
    });

    it('provides default template', () => {
      const { result } = renderHook(() => useResume(), { wrapper });
      
      expect(result.current.template).toBe('classic');
    });

    it('provides default zoom', () => {
      const { result } = renderHook(() => useResume(), { wrapper });
      
      expect(result.current.zoom).toBe(100);
    });

    it('has null editingField initially', () => {
      const { result } = renderHook(() => useResume(), { wrapper });
      
      expect(result.current.editingField).toBeNull();
    });
  });

  describe('updateContact', () => {
    it('updates contact fields', () => {
      const { result } = renderHook(() => useResume(), { wrapper });
      
      act(() => {
        result.current.updateContact({ fullName: 'Jane Smith' });
      });
      
      expect(result.current.data.contact.fullName).toBe('Jane Smith');
    });

    it('preserves other contact fields when updating', () => {
      const { result } = renderHook(() => useResume(), { wrapper });
      const originalEmail = result.current.data.contact.email;
      
      act(() => {
        result.current.updateContact({ fullName: 'Jane Smith' });
      });
      
      expect(result.current.data.contact.email).toBe(originalEmail);
    });

    it('updates multiple fields at once', () => {
      const { result } = renderHook(() => useResume(), { wrapper });
      
      act(() => {
        result.current.updateContact({
          fullName: 'Jane Smith',
          title: 'Product Manager',
          email: 'jane@example.com',
        });
      });
      
      expect(result.current.data.contact.fullName).toBe('Jane Smith');
      expect(result.current.data.contact.title).toBe('Product Manager');
      expect(result.current.data.contact.email).toBe('jane@example.com');
    });
  });

  describe('updateSummary', () => {
    it('updates summary text', () => {
      const { result } = renderHook(() => useResume(), { wrapper });
      
      act(() => {
        result.current.updateSummary('New professional summary');
      });
      
      expect(result.current.data.summary).toBe('New professional summary');
    });

    it('handles empty summary', () => {
      const { result } = renderHook(() => useResume(), { wrapper });
      
      act(() => {
        result.current.updateSummary('');
      });
      
      expect(result.current.data.summary).toBe('');
    });
  });

  describe('experience management', () => {
    it('adds new experience', () => {
      const { result } = renderHook(() => useResume(), { wrapper });
      const initialCount = result.current.data.experience.length;
      
      act(() => {
        result.current.addExperience();
      });
      
      expect(result.current.data.experience.length).toBe(initialCount + 1);
    });

    it('new experience has empty fields', () => {
      const { result } = renderHook(() => useResume(), { wrapper });
      
      act(() => {
        result.current.addExperience();
      });
      
      const newExp = result.current.data.experience[result.current.data.experience.length - 1];
      expect(newExp.company).toBe('');
      expect(newExp.position).toBe('');
      expect(newExp.highlights).toEqual([]);
    });

    it('updates experience by id', () => {
      const { result } = renderHook(() => useResume(), { wrapper });
      const expId = result.current.data.experience[0].id;
      
      act(() => {
        result.current.updateExperience(expId, { company: 'New Company' });
      });
      
      expect(result.current.data.experience[0].company).toBe('New Company');
    });

    it('preserves other experience fields when updating', () => {
      const { result } = renderHook(() => useResume(), { wrapper });
      const exp = result.current.data.experience[0];
      const originalPosition = exp.position;
      
      act(() => {
        result.current.updateExperience(exp.id, { company: 'New Company' });
      });
      
      expect(result.current.data.experience[0].position).toBe(originalPosition);
    });

    it('removes experience by id', () => {
      const { result } = renderHook(() => useResume(), { wrapper });
      const expId = result.current.data.experience[0].id;
      const initialCount = result.current.data.experience.length;
      
      act(() => {
        result.current.removeExperience(expId);
      });
      
      expect(result.current.data.experience.length).toBe(initialCount - 1);
      expect(result.current.data.experience.find(e => e.id === expId)).toBeUndefined();
    });

    it('updates experience highlights', () => {
      const { result } = renderHook(() => useResume(), { wrapper });
      const expId = result.current.data.experience[0].id;
      
      act(() => {
        result.current.updateExperience(expId, {
          highlights: ['New highlight 1', 'New highlight 2'],
        });
      });
      
      expect(result.current.data.experience[0].highlights).toEqual([
        'New highlight 1',
        'New highlight 2',
      ]);
    });
  });

  describe('education management', () => {
    it('adds new education', () => {
      const { result } = renderHook(() => useResume(), { wrapper });
      const initialCount = result.current.data.education.length;
      
      act(() => {
        result.current.addEducation();
      });
      
      expect(result.current.data.education.length).toBe(initialCount + 1);
    });

    it('updates education by id', () => {
      const { result } = renderHook(() => useResume(), { wrapper });
      const eduId = result.current.data.education[0].id;
      
      act(() => {
        result.current.updateEducation(eduId, { institution: 'MIT' });
      });
      
      expect(result.current.data.education[0].institution).toBe('MIT');
    });

    it('removes education by id', () => {
      const { result } = renderHook(() => useResume(), { wrapper });
      const eduId = result.current.data.education[0].id;
      const initialCount = result.current.data.education.length;
      
      act(() => {
        result.current.removeEducation(eduId);
      });
      
      expect(result.current.data.education.length).toBe(initialCount - 1);
    });
  });

  describe('skills management', () => {
    it('adds new skill', () => {
      const { result } = renderHook(() => useResume(), { wrapper });
      const initialCount = result.current.data.skills.length;
      
      act(() => {
        result.current.addSkill('TypeScript', 'Programming');
      });
      
      expect(result.current.data.skills.length).toBe(initialCount + 1);
      const newSkill = result.current.data.skills[result.current.data.skills.length - 1];
      expect(newSkill.name).toBe('TypeScript');
      expect(newSkill.category).toBe('Programming');
    });

    it('adds skill without category', () => {
      const { result } = renderHook(() => useResume(), { wrapper });
      
      act(() => {
        result.current.addSkill('Problem Solving');
      });
      
      const newSkill = result.current.data.skills[result.current.data.skills.length - 1];
      expect(newSkill.name).toBe('Problem Solving');
      expect(newSkill.category).toBeUndefined();
    });

    it('removes skill by id', () => {
      const { result } = renderHook(() => useResume(), { wrapper });
      const skillId = result.current.data.skills[0].id;
      const initialCount = result.current.data.skills.length;
      
      act(() => {
        result.current.removeSkill(skillId);
      });
      
      expect(result.current.data.skills.length).toBe(initialCount - 1);
    });

    it('updates all skills at once', () => {
      const { result } = renderHook(() => useResume(), { wrapper });
      const newSkills = [
        { id: '1', name: 'React', category: 'Frontend' },
        { id: '2', name: 'Node.js', category: 'Backend' },
      ];
      
      act(() => {
        result.current.updateSkills(newSkills);
      });
      
      expect(result.current.data.skills).toEqual(newSkills);
    });
  });

  describe('section management', () => {
    it('reorders sections', () => {
      const { result } = renderHook(() => useResume(), { wrapper });
      const sections = [...result.current.sections];
      
      // Move experience to first position
      const newOrder = [
        sections[2], // experience
        sections[0], // contact
        sections[1], // summary
        sections[3], // education
        sections[4], // skills
      ];
      
      act(() => {
        result.current.reorderSections(newOrder);
      });
      
      expect(result.current.sections[0].id).toBe('experience');
      expect(result.current.sections[0].order).toBe(0);
      expect(result.current.sections[1].order).toBe(1);
    });

    it('toggles section visibility', () => {
      const { result } = renderHook(() => useResume(), { wrapper });
      const section = result.current.sections.find(s => s.id === 'summary');
      const wasVisible = section?.visible;
      
      act(() => {
        result.current.toggleSectionVisibility('summary');
      });
      
      const updatedSection = result.current.sections.find(s => s.id === 'summary');
      expect(updatedSection?.visible).toBe(!wasVisible);
    });

    it('toggles visibility back', () => {
      const { result } = renderHook(() => useResume(), { wrapper });
      
      act(() => {
        result.current.toggleSectionVisibility('summary');
        result.current.toggleSectionVisibility('summary');
      });
      
      const section = result.current.sections.find(s => s.id === 'summary');
      expect(section?.visible).toBe(true);
    });
  });

  describe('template management', () => {
    it('sets template', () => {
      const { result } = renderHook(() => useResume(), { wrapper });
      
      act(() => {
        result.current.setTemplate('modern');
      });
      
      expect(result.current.template).toBe('modern');
    });

    it('sets different template types', () => {
      const { result } = renderHook(() => useResume(), { wrapper });
      
      const templates = ['classic', 'modern', 'minimal', 'two-column'] as const;
      
      templates.forEach(template => {
        act(() => {
          result.current.setTemplate(template);
        });
        expect(result.current.template).toBe(template);
      });
    });
  });

  describe('editing field management', () => {
    it('sets editing field', () => {
      const { result } = renderHook(() => useResume(), { wrapper });
      
      act(() => {
        result.current.setEditingField('contact.fullName');
      });
      
      expect(result.current.editingField).toBe('contact.fullName');
    });

    it('clears editing field', () => {
      const { result } = renderHook(() => useResume(), { wrapper });
      
      act(() => {
        result.current.setEditingField('contact.fullName');
        result.current.setEditingField(null);
      });
      
      expect(result.current.editingField).toBeNull();
    });
  });

  describe('zoom management', () => {
    it('sets zoom level', () => {
      const { result } = renderHook(() => useResume(), { wrapper });
      
      act(() => {
        result.current.setZoom(150);
      });
      
      expect(result.current.zoom).toBe(150);
    });

    it('allows different zoom levels', () => {
      const { result } = renderHook(() => useResume(), { wrapper });
      
      const zoomLevels = [50, 75, 100, 125, 150, 200];
      
      zoomLevels.forEach(zoom => {
        act(() => {
          result.current.setZoom(zoom);
        });
        expect(result.current.zoom).toBe(zoom);
      });
    });
  });

  describe('error handling', () => {
    it('throws error when used outside provider', () => {
      // Suppress console.error for this test since React will log the error
      const originalError = console.error;
      console.error = vi.fn();
      
      let thrownError: Error | null = null;
      try {
        renderHook(() => useResume());
      } catch (error) {
        thrownError = error as Error;
      }
      
      expect(thrownError).not.toBeNull();
      expect(thrownError?.message).toBe('useResume must be used within a ResumeProvider');
      
      console.error = originalError;
    });
  });
});

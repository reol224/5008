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
      
      // 5 core sections + 3 optional sections (certifications, publications, awards)
      expect(result.current.sections).toHaveLength(8);
      expect(result.current.sections[0].id).toBe('contact');
      // Optional sections should be hidden by default
      expect(result.current.sections.find(s => s.id === 'certifications')?.visible).toBe(false);
      expect(result.current.sections.find(s => s.id === 'publications')?.visible).toBe(false);
      expect(result.current.sections.find(s => s.id === 'awards')?.visible).toBe(false);
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

  describe('certifications operations', () => {
    it('adds certification', () => {
      const { result } = renderHook(() => useResume(), { wrapper });
      
      act(() => {
        result.current.addCertification();
      });
      
      expect(result.current.data.certifications).toHaveLength(1);
      expect(result.current.data.certifications[0].name).toBe('');
    });

    it('updates certification', () => {
      const { result } = renderHook(() => useResume(), { wrapper });
      
      act(() => {
        result.current.addCertification();
      });
      
      const certId = result.current.data.certifications[0].id;
      
      act(() => {
        result.current.updateCertification(certId, { 
          name: 'AWS Solutions Architect',
          issuer: 'Amazon Web Services'
        });
      });
      
      expect(result.current.data.certifications[0].name).toBe('AWS Solutions Architect');
      expect(result.current.data.certifications[0].issuer).toBe('Amazon Web Services');
    });

    it('removes certification', () => {
      const { result } = renderHook(() => useResume(), { wrapper });
      
      act(() => {
        result.current.addCertification();
      });
      
      const certId = result.current.data.certifications[0].id;
      
      act(() => {
        result.current.removeCertification(certId);
      });
      
      expect(result.current.data.certifications).toHaveLength(0);
    });
  });

  describe('publications operations', () => {
    it('adds publication', () => {
      const { result } = renderHook(() => useResume(), { wrapper });
      
      act(() => {
        result.current.addPublication();
      });
      
      expect(result.current.data.publications).toHaveLength(1);
      expect(result.current.data.publications[0].title).toBe('');
    });

    it('updates publication', () => {
      const { result } = renderHook(() => useResume(), { wrapper });
      
      act(() => {
        result.current.addPublication();
      });
      
      const pubId = result.current.data.publications[0].id;
      
      act(() => {
        result.current.updatePublication(pubId, { 
          title: 'Machine Learning in Practice',
          publisher: 'IEEE'
        });
      });
      
      expect(result.current.data.publications[0].title).toBe('Machine Learning in Practice');
      expect(result.current.data.publications[0].publisher).toBe('IEEE');
    });

    it('removes publication', () => {
      const { result } = renderHook(() => useResume(), { wrapper });
      
      act(() => {
        result.current.addPublication();
      });
      
      const pubId = result.current.data.publications[0].id;
      
      act(() => {
        result.current.removePublication(pubId);
      });
      
      expect(result.current.data.publications).toHaveLength(0);
    });
  });

  describe('awards operations', () => {
    it('adds award', () => {
      const { result } = renderHook(() => useResume(), { wrapper });
      
      act(() => {
        result.current.addAward();
      });
      
      expect(result.current.data.awards).toHaveLength(1);
      expect(result.current.data.awards[0].title).toBe('');
    });

    it('updates award', () => {
      const { result } = renderHook(() => useResume(), { wrapper });
      
      act(() => {
        result.current.addAward();
      });
      
      const awardId = result.current.data.awards[0].id;
      
      act(() => {
        result.current.updateAward(awardId, { 
          title: 'Employee of the Year',
          issuer: 'TechCorp'
        });
      });
      
      expect(result.current.data.awards[0].title).toBe('Employee of the Year');
      expect(result.current.data.awards[0].issuer).toBe('TechCorp');
    });

    it('removes award', () => {
      const { result } = renderHook(() => useResume(), { wrapper });
      
      act(() => {
        result.current.addAward();
      });
      
      const awardId = result.current.data.awards[0].id;
      
      act(() => {
        result.current.removeAward(awardId);
      });
      
      expect(result.current.data.awards).toHaveLength(0);
    });
  });

  describe('custom sections operations', () => {
    it('adds custom section', () => {
      const { result } = renderHook(() => useResume(), { wrapper });
      
      act(() => {
        result.current.addCustomSection('Projects');
      });
      
      expect(result.current.data.customSections).toHaveLength(1);
      expect(result.current.data.customSections[0].title).toBe('Projects');
      
      // Should also add to sections list
      const customSection = result.current.sections.find(s => s.id.startsWith('custom-'));
      expect(customSection).toBeDefined();
      expect(customSection?.title).toBe('Projects');
      expect(customSection?.visible).toBe(true);
      expect(customSection?.isCustom).toBe(true);
    });

    it('removes custom section', () => {
      const { result } = renderHook(() => useResume(), { wrapper });
      
      act(() => {
        result.current.addCustomSection('Projects');
      });
      
      const sectionId = result.current.data.customSections[0].id;
      
      act(() => {
        result.current.removeCustomSection(sectionId);
      });
      
      expect(result.current.data.customSections).toHaveLength(0);
      expect(result.current.sections.find(s => s.id === sectionId)).toBeUndefined();
    });

    it('updates custom section title', () => {
      const { result } = renderHook(() => useResume(), { wrapper });
      
      act(() => {
        result.current.addCustomSection('Projects');
      });
      
      const sectionId = result.current.data.customSections[0].id;
      
      act(() => {
        result.current.updateCustomSectionTitle(sectionId, 'Volunteer Work');
      });
      
      expect(result.current.data.customSections[0].title).toBe('Volunteer Work');
      expect(result.current.sections.find(s => s.id === sectionId)?.title).toBe('Volunteer Work');
    });

    it('adds custom section item', () => {
      const { result } = renderHook(() => useResume(), { wrapper });
      
      act(() => {
        result.current.addCustomSection('Projects');
      });
      
      const sectionId = result.current.data.customSections[0].id;
      
      act(() => {
        result.current.addCustomSectionItem(sectionId);
      });
      
      expect(result.current.data.customSections[0].items).toHaveLength(1);
      expect(result.current.data.customSections[0].items[0].title).toBe('');
    });

    it('updates custom section item', () => {
      const { result } = renderHook(() => useResume(), { wrapper });
      
      act(() => {
        result.current.addCustomSection('Projects');
      });
      
      const sectionId = result.current.data.customSections[0].id;
      
      act(() => {
        result.current.addCustomSectionItem(sectionId);
      });
      
      const itemId = result.current.data.customSections[0].items[0].id;
      
      act(() => {
        result.current.updateCustomSectionItem(sectionId, itemId, {
          title: 'Project Alpha',
          subtitle: 'Lead Developer',
          description: 'Built amazing things'
        });
      });
      
      const item = result.current.data.customSections[0].items[0];
      expect(item.title).toBe('Project Alpha');
      expect(item.subtitle).toBe('Lead Developer');
      expect(item.description).toBe('Built amazing things');
    });

    it('removes custom section item', () => {
      const { result } = renderHook(() => useResume(), { wrapper });
      
      act(() => {
        result.current.addCustomSection('Projects');
      });
      
      const sectionId = result.current.data.customSections[0].id;
      
      act(() => {
        result.current.addCustomSectionItem(sectionId);
      });
      
      const itemId = result.current.data.customSections[0].items[0].id;
      
      act(() => {
        result.current.removeCustomSectionItem(sectionId, itemId);
      });
      
      expect(result.current.data.customSections[0].items).toHaveLength(0);
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

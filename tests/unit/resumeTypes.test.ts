import { describe, it, expect } from 'vitest';
import type {
  ContactInfo,
  Experience,
  Education,
  Skill,
  ResumeData,
  SectionConfig,
  SectionType,
  TemplateType,
} from '@/types/resume';

describe('Resume Types', () => {
  describe('ContactInfo', () => {
    it('should have required fields', () => {
      const contact: ContactInfo = {
        fullName: 'John Doe',
        title: 'Software Engineer',
        email: 'john@example.com',
        phone: '555-1234',
        location: 'New York, NY',
      };
      
      expect(contact.fullName).toBe('John Doe');
      expect(contact.title).toBe('Software Engineer');
      expect(contact.email).toBe('john@example.com');
      expect(contact.phone).toBe('555-1234');
      expect(contact.location).toBe('New York, NY');
    });

    it('should allow optional linkedin and website', () => {
      const contact: ContactInfo = {
        fullName: 'John Doe',
        title: 'Software Engineer',
        email: 'john@example.com',
        phone: '555-1234',
        location: 'New York, NY',
        linkedin: 'linkedin.com/in/johndoe',
        website: 'johndoe.com',
      };
      
      expect(contact.linkedin).toBe('linkedin.com/in/johndoe');
      expect(contact.website).toBe('johndoe.com');
    });
  });

  describe('Experience', () => {
    it('should have all required fields', () => {
      const exp: Experience = {
        id: '1',
        company: 'Tech Corp',
        position: 'Senior Developer',
        startDate: '2020',
        endDate: 'Present',
        description: 'Led development team',
        highlights: ['Built new features', 'Improved performance'],
      };
      
      expect(exp.id).toBe('1');
      expect(exp.company).toBe('Tech Corp');
      expect(exp.position).toBe('Senior Developer');
      expect(exp.startDate).toBe('2020');
      expect(exp.endDate).toBe('Present');
      expect(exp.description).toBe('Led development team');
      expect(exp.highlights).toHaveLength(2);
    });

    it('should allow empty highlights array', () => {
      const exp: Experience = {
        id: '1',
        company: 'Tech Corp',
        position: 'Developer',
        startDate: '2020',
        endDate: '2023',
        description: '',
        highlights: [],
      };
      
      expect(exp.highlights).toEqual([]);
    });
  });

  describe('Education', () => {
    it('should have required fields', () => {
      const edu: Education = {
        id: '1',
        institution: 'University of Tech',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        startDate: '2016',
        endDate: '2020',
      };
      
      expect(edu.id).toBe('1');
      expect(edu.institution).toBe('University of Tech');
      expect(edu.degree).toBe('Bachelor of Science');
      expect(edu.field).toBe('Computer Science');
    });

    it('should allow optional gpa', () => {
      const edu: Education = {
        id: '1',
        institution: 'University of Tech',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        startDate: '2016',
        endDate: '2020',
        gpa: '3.8',
      };
      
      expect(edu.gpa).toBe('3.8');
    });
  });

  describe('Skill', () => {
    it('should have required fields', () => {
      const skill: Skill = {
        id: '1',
        name: 'JavaScript',
      };
      
      expect(skill.id).toBe('1');
      expect(skill.name).toBe('JavaScript');
    });

    it('should allow optional category', () => {
      const skill: Skill = {
        id: '1',
        name: 'JavaScript',
        category: 'Programming Languages',
      };
      
      expect(skill.category).toBe('Programming Languages');
    });
  });

  describe('ResumeData', () => {
    it('should combine all sections', () => {
      const resume: ResumeData = {
        contact: {
          fullName: 'John Doe',
          title: 'Developer',
          email: 'john@example.com',
          phone: '555-1234',
          location: 'NYC',
        },
        summary: 'Experienced developer',
        experience: [],
        education: [],
        skills: [],
      };
      
      expect(resume.contact).toBeDefined();
      expect(resume.summary).toBe('Experienced developer');
      expect(resume.experience).toEqual([]);
      expect(resume.education).toEqual([]);
      expect(resume.skills).toEqual([]);
    });
  });

  describe('SectionConfig', () => {
    it('should have all required fields', () => {
      const config: SectionConfig = {
        id: 'experience',
        title: 'Experience',
        visible: true,
        order: 2,
      };
      
      expect(config.id).toBe('experience');
      expect(config.title).toBe('Experience');
      expect(config.visible).toBe(true);
      expect(config.order).toBe(2);
    });
  });

  describe('SectionType', () => {
    it('should accept valid section types', () => {
      const types: SectionType[] = ['contact', 'summary', 'experience', 'education', 'skills'];
      expect(types).toHaveLength(5);
    });
  });

  describe('TemplateType', () => {
    it('should accept valid template types', () => {
      const templates: TemplateType[] = ['classic', 'modern', 'minimal', 'two-column'];
      expect(templates).toHaveLength(4);
    });
  });
});

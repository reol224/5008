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
  Certification,
  Publication,
  Award,
  CustomSection,
  CustomSectionItem,
  BuiltInSectionType,
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
        certifications: [],
        publications: [],
        awards: [],
        customSections: [],
      };
      
      expect(resume.contact).toBeDefined();
      expect(resume.summary).toBe('Experienced developer');
      expect(resume.experience).toEqual([]);
      expect(resume.education).toEqual([]);
      expect(resume.skills).toEqual([]);
      expect(resume.certifications).toEqual([]);
      expect(resume.publications).toEqual([]);
      expect(resume.awards).toEqual([]);
      expect(resume.customSections).toEqual([]);
    });
  });

  describe('Certification', () => {
    it('should have all required fields', () => {
      const cert: Certification = {
        id: '1',
        name: 'AWS Solutions Architect',
        issuer: 'Amazon Web Services',
        date: '2023',
      };
      
      expect(cert.id).toBe('1');
      expect(cert.name).toBe('AWS Solutions Architect');
      expect(cert.issuer).toBe('Amazon Web Services');
      expect(cert.date).toBe('2023');
    });

    it('should allow optional fields', () => {
      const cert: Certification = {
        id: '1',
        name: 'AWS Solutions Architect',
        issuer: 'Amazon Web Services',
        date: '2023',
        expiryDate: '2026',
        credentialId: 'ABC123',
      };
      
      expect(cert.expiryDate).toBe('2026');
      expect(cert.credentialId).toBe('ABC123');
    });
  });

  describe('Publication', () => {
    it('should have all required fields', () => {
      const pub: Publication = {
        id: '1',
        title: 'Machine Learning in Practice',
        publisher: 'IEEE',
        date: '2022',
      };
      
      expect(pub.id).toBe('1');
      expect(pub.title).toBe('Machine Learning in Practice');
      expect(pub.publisher).toBe('IEEE');
      expect(pub.date).toBe('2022');
    });

    it('should allow optional fields', () => {
      const pub: Publication = {
        id: '1',
        title: 'Machine Learning in Practice',
        publisher: 'IEEE',
        date: '2022',
        url: 'https://example.com/paper',
        description: 'A paper about ML',
      };
      
      expect(pub.url).toBe('https://example.com/paper');
      expect(pub.description).toBe('A paper about ML');
    });
  });

  describe('Award', () => {
    it('should have all required fields', () => {
      const award: Award = {
        id: '1',
        title: 'Employee of the Year',
        issuer: 'TechCorp',
        date: '2023',
      };
      
      expect(award.id).toBe('1');
      expect(award.title).toBe('Employee of the Year');
      expect(award.issuer).toBe('TechCorp');
      expect(award.date).toBe('2023');
    });

    it('should allow optional description', () => {
      const award: Award = {
        id: '1',
        title: 'Employee of the Year',
        issuer: 'TechCorp',
        date: '2023',
        description: 'Awarded for outstanding performance',
      };
      
      expect(award.description).toBe('Awarded for outstanding performance');
    });
  });

  describe('CustomSectionItem', () => {
    it('should have required fields', () => {
      const item: CustomSectionItem = {
        id: '1',
        title: 'Project Alpha',
      };
      
      expect(item.id).toBe('1');
      expect(item.title).toBe('Project Alpha');
    });

    it('should allow optional fields', () => {
      const item: CustomSectionItem = {
        id: '1',
        title: 'Project Alpha',
        subtitle: 'Lead Developer',
        date: '2023',
        description: 'Led development of a major feature',
      };
      
      expect(item.subtitle).toBe('Lead Developer');
      expect(item.date).toBe('2023');
      expect(item.description).toBe('Led development of a major feature');
    });
  });

  describe('CustomSection', () => {
    it('should have all required fields', () => {
      const section: CustomSection = {
        id: 'custom-1',
        title: 'Projects',
        items: [],
      };
      
      expect(section.id).toBe('custom-1');
      expect(section.title).toBe('Projects');
      expect(section.items).toEqual([]);
    });

    it('should contain custom items', () => {
      const section: CustomSection = {
        id: 'custom-1',
        title: 'Projects',
        items: [
          { id: '1', title: 'Project Alpha' },
          { id: '2', title: 'Project Beta', subtitle: 'Open Source' },
        ],
      };
      
      expect(section.items).toHaveLength(2);
      expect(section.items[0].title).toBe('Project Alpha');
      expect(section.items[1].subtitle).toBe('Open Source');
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

    it('should allow isCustom flag for custom sections', () => {
      const config: SectionConfig = {
        id: 'custom-1' as SectionType,
        title: 'Custom Section',
        visible: true,
        order: 10,
        isCustom: true,
      };
      
      expect(config.isCustom).toBe(true);
    });
  });

  describe('SectionType', () => {
    it('should accept valid built-in section types', () => {
      const types: BuiltInSectionType[] = [
        'contact', 'summary', 'experience', 'education', 'skills',
        'certifications', 'publications', 'awards'
      ];
      expect(types).toHaveLength(8);
    });

    it('should accept custom section types', () => {
      const customType: SectionType = 'custom-123';
      expect(customType.startsWith('custom-')).toBe(true);
    });
  });

  describe('TemplateType', () => {
    it('should accept valid template types', () => {
      const templates: TemplateType[] = ['classic', 'modern', 'minimal', 'two-column'];
      expect(templates).toHaveLength(4);
    });
  });
});

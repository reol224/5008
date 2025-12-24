export interface ContactInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  highlights: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface Skill {
  id: string;
  name: string;
  category?: string;
}

export interface ResumeData {
  contact: ContactInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
}

export type SectionType = 'contact' | 'summary' | 'experience' | 'education' | 'skills';

export interface SectionConfig {
  id: SectionType;
  title: string;
  visible: boolean;
  order: number;
}

export type TemplateType = 'classic' | 'modern' | 'minimal' | 'two-column';

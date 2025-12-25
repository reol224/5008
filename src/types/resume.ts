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

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
}

export interface Publication {
  id: string;
  title: string;
  publisher: string;
  date: string;
  url?: string;
  description?: string;
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  description?: string;
}

export interface CustomSection {
  id: string;
  title: string;
  items: CustomSectionItem[];
}

export interface ResumeData {
  contact: ContactInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  certifications: Certification[];
  publications: Publication[];
  awards: Award[];
  customSections: CustomSection[];
}

// Built-in section types
export type BuiltInSectionType = 'contact' | 'summary' | 'experience' | 'education' | 'skills' | 'certifications' | 'publications' | 'awards';

// Section type can be a built-in type or a custom section ID (prefixed with 'custom-')
export type SectionType = BuiltInSectionType | `custom-${string}`;

export interface SectionConfig {
  id: SectionType;
  title: string;
  visible: boolean;
  order: number;
  isCustom?: boolean;
}

export type TemplateType = 'classic' | 'modern' | 'minimal' | 'two-column';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { 
  ResumeData, 
  SectionConfig, 
  TemplateType, 
  Experience, 
  Education, 
  Skill,
  ContactInfo,
  Certification,
  Publication,
  Award,
  CustomSection,
  CustomSectionItem,
  SectionType
} from '@/types/resume';

const defaultResumeData: ResumeData = {
  contact: {
    fullName: 'Alex Johnson',
    title: 'Senior Product Designer',
    email: 'alex.johnson@email.com',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexjohnson',
    website: 'alexjohnson.design',
  },
  summary: 'Product designer with 8+ years of experience crafting user-centered digital experiences for startups and enterprise clients. Passionate about design systems, accessibility, and bridging the gap between user needs and business goals.',
  experience: [
    {
      id: '1',
      company: 'TechCorp Inc.',
      position: 'Senior Product Designer',
      startDate: '2021',
      endDate: 'Present',
      description: 'Lead designer for the core product team, responsible for design system architecture and user research initiatives.',
      highlights: [
        'Led redesign of flagship product, increasing user engagement by 40%',
        'Built and maintained design system used by 50+ designers',
        'Conducted user research with 200+ participants',
      ],
    },
    {
      id: '2',
      company: 'StartupXYZ',
      position: 'Product Designer',
      startDate: '2018',
      endDate: '2021',
      description: 'Full-stack designer responsible for product design from concept to launch.',
      highlights: [
        'Designed MVP that helped secure $5M Series A funding',
        'Created brand identity and marketing materials',
        'Established design culture and hiring practices',
      ],
    },
  ],
  education: [
    {
      id: '1',
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Arts',
      field: 'Cognitive Science',
      startDate: '2010',
      endDate: '2014',
      gpa: '3.8',
    },
  ],
  skills: [
    { id: '1', name: 'Figma', category: 'Design Tools' },
    { id: '2', name: 'Sketch', category: 'Design Tools' },
    { id: '3', name: 'Adobe Creative Suite', category: 'Design Tools' },
    { id: '4', name: 'User Research', category: 'Skills' },
    { id: '5', name: 'Prototyping', category: 'Skills' },
    { id: '6', name: 'Design Systems', category: 'Skills' },
    { id: '7', name: 'HTML/CSS', category: 'Technical' },
    { id: '8', name: 'JavaScript', category: 'Technical' },
  ],
  certifications: [],
  publications: [],
  awards: [],
  customSections: [],
};

const defaultSections: SectionConfig[] = [
  { id: 'contact', title: 'Contact', visible: true, order: 0 },
  { id: 'summary', title: 'Summary', visible: true, order: 1 },
  { id: 'experience', title: 'Experience', visible: true, order: 2 },
  { id: 'education', title: 'Education', visible: true, order: 3 },
  { id: 'skills', title: 'Skills', visible: true, order: 4 },
  { id: 'certifications', title: 'Certifications', visible: false, order: 5 },
  { id: 'publications', title: 'Publications', visible: false, order: 6 },
  { id: 'awards', title: 'Awards', visible: false, order: 7 },
];

interface ResumeContextType {
  data: ResumeData;
  sections: SectionConfig[];
  template: TemplateType;
  editingField: string | null;
  zoom: number;
  updateContact: (contact: Partial<ContactInfo>) => void;
  updateSummary: (summary: string) => void;
  updateExperience: (id: string, experience: Partial<Experience>) => void;
  addExperience: () => void;
  removeExperience: (id: string) => void;
  updateEducation: (id: string, education: Partial<Education>) => void;
  addEducation: () => void;
  removeEducation: (id: string) => void;
  updateSkills: (skills: Skill[]) => void;
  addSkill: (name: string, category?: string) => void;
  removeSkill: (id: string) => void;
  // Certifications
  updateCertification: (id: string, certification: Partial<Certification>) => void;
  addCertification: () => void;
  removeCertification: (id: string) => void;
  // Publications
  updatePublication: (id: string, publication: Partial<Publication>) => void;
  addPublication: () => void;
  removePublication: (id: string) => void;
  // Awards
  updateAward: (id: string, award: Partial<Award>) => void;
  addAward: () => void;
  removeAward: (id: string) => void;
  // Custom Sections
  addCustomSection: (title: string) => void;
  removeCustomSection: (sectionId: string) => void;
  updateCustomSectionTitle: (sectionId: string, title: string) => void;
  addCustomSectionItem: (sectionId: string) => void;
  updateCustomSectionItem: (sectionId: string, itemId: string, item: Partial<CustomSectionItem>) => void;
  removeCustomSectionItem: (sectionId: string, itemId: string) => void;
  // Sections
  reorderSections: (sections: SectionConfig[]) => void;
  toggleSectionVisibility: (id: SectionType) => void;
  setTemplate: (template: TemplateType) => void;
  setEditingField: (field: string | null) => void;
  setZoom: (zoom: number) => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function ResumeProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<ResumeData>(defaultResumeData);
  const [sections, setSections] = useState<SectionConfig[]>(defaultSections);
  const [template, setTemplate] = useState<TemplateType>('classic');
  const [editingField, setEditingField] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);

  const updateContact = useCallback((contact: Partial<ContactInfo>) => {
    setData(prev => ({ ...prev, contact: { ...prev.contact, ...contact } }));
  }, []);

  const updateSummary = useCallback((summary: string) => {
    setData(prev => ({ ...prev, summary }));
  }, []);

  const updateExperience = useCallback((id: string, experience: Partial<Experience>) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, ...experience } : exp
      ),
    }));
  }, []);

  const addExperience = useCallback(() => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
      highlights: [],
    };
    setData(prev => ({ ...prev, experience: [...prev.experience, newExp] }));
  }, []);

  const removeExperience = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id),
    }));
  }, []);

  const updateEducation = useCallback((id: string, education: Partial<Education>) => {
    setData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, ...education } : edu
      ),
    }));
  }, []);

  const addEducation = useCallback(() => {
    const newEdu: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
    };
    setData(prev => ({ ...prev, education: [...prev.education, newEdu] }));
  }, []);

  const removeEducation = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id),
    }));
  }, []);

  const updateSkills = useCallback((skills: Skill[]) => {
    setData(prev => ({ ...prev, skills }));
  }, []);

  const addSkill = useCallback((name: string, category?: string) => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name,
      category,
    };
    setData(prev => ({ ...prev, skills: [...prev.skills, newSkill] }));
  }, []);

  const removeSkill = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id),
    }));
  }, []);

  // Certifications
  const updateCertification = useCallback((id: string, certification: Partial<Certification>) => {
    setData(prev => ({
      ...prev,
      certifications: prev.certifications.map(cert => 
        cert.id === id ? { ...cert, ...certification } : cert
      ),
    }));
  }, []);

  const addCertification = useCallback(() => {
    const newCert: Certification = {
      id: Date.now().toString(),
      name: '',
      issuer: '',
      date: '',
    };
    setData(prev => ({ ...prev, certifications: [...prev.certifications, newCert] }));
  }, []);

  const removeCertification = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert.id !== id),
    }));
  }, []);

  // Publications
  const updatePublication = useCallback((id: string, publication: Partial<Publication>) => {
    setData(prev => ({
      ...prev,
      publications: prev.publications.map(pub => 
        pub.id === id ? { ...pub, ...publication } : pub
      ),
    }));
  }, []);

  const addPublication = useCallback(() => {
    const newPub: Publication = {
      id: Date.now().toString(),
      title: '',
      publisher: '',
      date: '',
    };
    setData(prev => ({ ...prev, publications: [...prev.publications, newPub] }));
  }, []);

  const removePublication = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      publications: prev.publications.filter(pub => pub.id !== id),
    }));
  }, []);

  // Awards
  const updateAward = useCallback((id: string, award: Partial<Award>) => {
    setData(prev => ({
      ...prev,
      awards: prev.awards.map(a => 
        a.id === id ? { ...a, ...award } : a
      ),
    }));
  }, []);

  const addAward = useCallback(() => {
    const newAward: Award = {
      id: Date.now().toString(),
      title: '',
      issuer: '',
      date: '',
    };
    setData(prev => ({ ...prev, awards: [...prev.awards, newAward] }));
  }, []);

  const removeAward = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      awards: prev.awards.filter(a => a.id !== id),
    }));
  }, []);

  // Custom Sections
  const addCustomSection = useCallback((title: string) => {
    const sectionId = `custom-${Date.now()}`;
    const newCustomSection: CustomSection = {
      id: sectionId,
      title,
      items: [],
    };
    setData(prev => ({ ...prev, customSections: [...prev.customSections, newCustomSection] }));
    setSections(prev => [
      ...prev,
      { id: sectionId as SectionType, title, visible: true, order: prev.length, isCustom: true }
    ]);
  }, []);

  const removeCustomSection = useCallback((sectionId: string) => {
    setData(prev => ({
      ...prev,
      customSections: prev.customSections.filter(s => s.id !== sectionId),
    }));
    setSections(prev => prev.filter(s => s.id !== sectionId));
  }, []);

  const updateCustomSectionTitle = useCallback((sectionId: string, title: string) => {
    setData(prev => ({
      ...prev,
      customSections: prev.customSections.map(s => 
        s.id === sectionId ? { ...s, title } : s
      ),
    }));
    setSections(prev => prev.map(s => 
      s.id === sectionId ? { ...s, title } : s
    ));
  }, []);

  const addCustomSectionItem = useCallback((sectionId: string) => {
    const newItem: CustomSectionItem = {
      id: Date.now().toString(),
      title: '',
    };
    setData(prev => ({
      ...prev,
      customSections: prev.customSections.map(s => 
        s.id === sectionId ? { ...s, items: [...s.items, newItem] } : s
      ),
    }));
  }, []);

  const updateCustomSectionItem = useCallback((sectionId: string, itemId: string, item: Partial<CustomSectionItem>) => {
    setData(prev => ({
      ...prev,
      customSections: prev.customSections.map(s => 
        s.id === sectionId 
          ? { ...s, items: s.items.map(i => i.id === itemId ? { ...i, ...item } : i) }
          : s
      ),
    }));
  }, []);

  const removeCustomSectionItem = useCallback((sectionId: string, itemId: string) => {
    setData(prev => ({
      ...prev,
      customSections: prev.customSections.map(s => 
        s.id === sectionId 
          ? { ...s, items: s.items.filter(i => i.id !== itemId) }
          : s
      ),
    }));
  }, []);

  const reorderSections = useCallback((newSections: SectionConfig[]) => {
    // Update the order property based on new positions
    const updatedSections = newSections.map((section, index) => ({
      ...section,
      order: index,
    }));
    setSections(updatedSections);
  }, []);

  const toggleSectionVisibility = useCallback((id: SectionType) => {
    setSections(prev => prev.map(section => 
      section.id === id ? { ...section, visible: !section.visible } : section
    ));
  }, []);

  return (
    <ResumeContext.Provider
      value={{
        data,
        sections,
        template,
        editingField,
        zoom,
        updateContact,
        updateSummary,
        updateExperience,
        addExperience,
        removeExperience,
        updateEducation,
        addEducation,
        removeEducation,
        updateSkills,
        addSkill,
        removeSkill,
        updateCertification,
        addCertification,
        removeCertification,
        updatePublication,
        addPublication,
        removePublication,
        updateAward,
        addAward,
        removeAward,
        addCustomSection,
        removeCustomSection,
        updateCustomSectionTitle,
        addCustomSectionItem,
        updateCustomSectionItem,
        removeCustomSectionItem,
        reorderSections,
        toggleSectionVisibility,
        setTemplate,
        setEditingField,
        setZoom,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
}

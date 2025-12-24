import { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { SectionConfig } from '@/types/resume';
import { ContactSection } from './sections/ContactSection';
import { SummarySection } from './sections/SummarySection';
import { ExperienceSection } from './sections/ExperienceSection';
import { EducationSection } from './sections/EducationSection';
import { SkillsSection } from './sections/SkillsSection';
import { GripVertical, ChevronDown, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CollapsibleSectionProps {
  section: SectionConfig;
  children: React.ReactNode;
  onToggleVisibility: () => void;
}

function CollapsibleSection({ section, children, onToggleVisibility }: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="group bg-white/50 rounded-md border border-black/[0.06] overflow-hidden"
    >
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-black/[0.04]">
        <GripVertical className="w-4 h-4 text-muted-foreground/50 cursor-grab active:cursor-grabbing" />
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 flex-1 text-left"
        >
          {isExpanded ? (
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
          )}
          <span className="font-mono-ui text-xs font-light tracking-wide uppercase text-muted-foreground">
            {section.title}
          </span>
        </button>
        <button
          onClick={onToggleVisibility}
          className={cn(
            "p-1 rounded transition-colors",
            section.visible 
              ? "text-muted-foreground hover:text-foreground" 
              : "text-muted-foreground/40 hover:text-muted-foreground"
          )}
        >
          {section.visible ? (
            <Eye className="w-3.5 h-3.5" />
          ) : (
            <EyeOff className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className={cn(
              "p-4 transition-opacity",
              !section.visible && "opacity-50"
            )}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function EditorPane() {
  const { sections, reorderSections, toggleSectionVisibility } = useResume();

  const getSectionComponent = (sectionId: string) => {
    switch (sectionId) {
      case 'contact':
        return <ContactSection />;
      case 'summary':
        return <SummarySection />;
      case 'experience':
        return <ExperienceSection />;
      case 'education':
        return <EducationSection />;
      case 'skills':
        return <SkillsSection />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#FAFAF9] to-[#F5F5F4]">
      <div className="p-6 border-b border-black/[0.06]">
        <h1 className="font-display text-lg font-bold text-foreground">Resume Editor</h1>
        <p className="font-mono-ui text-xs font-light text-muted-foreground mt-1">
          Drag sections to reorder
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <Reorder.Group
          axis="y"
          values={sections}
          onReorder={reorderSections}
          className="space-y-3"
        >
          {sections.map((section) => (
            <Reorder.Item
              key={section.id}
              value={section}
              className="list-none"
            >
              <CollapsibleSection
                section={section}
                onToggleVisibility={() => toggleSectionVisibility(section.id)}
              >
                {getSectionComponent(section.id)}
              </CollapsibleSection>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>
    </div>
  );
}

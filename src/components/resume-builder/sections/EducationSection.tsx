import { useResume } from '@/contexts/ResumeContext';
import { FloatingInput } from '../FloatingInput';
import { Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function EducationSection() {
  const { data, updateEducation, addEducation, removeEducation, setEditingField } = useResume();

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {data.education.map((edu) => (
          <motion.div
            key={edu.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="relative p-3 bg-white/30 rounded-md border border-black/[0.04] group"
          >
            <button
              onClick={() => removeEducation(edu.id)}
              className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            
            <div className="space-y-2">
              <FloatingInput
                label="Institution"
                value={edu.institution}
                onChange={(value) => updateEducation(edu.id, { institution: value })}
                onFocus={() => setEditingField(`education.${edu.id}.institution`)}
                onBlur={() => setEditingField(null)}
              />
              <div className="grid grid-cols-2 gap-2">
                <FloatingInput
                  label="Degree"
                  value={edu.degree}
                  onChange={(value) => updateEducation(edu.id, { degree: value })}
                  onFocus={() => setEditingField(`education.${edu.id}.degree`)}
                  onBlur={() => setEditingField(null)}
                />
                <FloatingInput
                  label="Field of Study"
                  value={edu.field}
                  onChange={(value) => updateEducation(edu.id, { field: value })}
                  onFocus={() => setEditingField(`education.${edu.id}.field`)}
                  onBlur={() => setEditingField(null)}
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <FloatingInput
                  label="Start Year"
                  value={edu.startDate}
                  onChange={(value) => updateEducation(edu.id, { startDate: value })}
                  onFocus={() => setEditingField(`education.${edu.id}.startDate`)}
                  onBlur={() => setEditingField(null)}
                />
                <FloatingInput
                  label="End Year"
                  value={edu.endDate}
                  onChange={(value) => updateEducation(edu.id, { endDate: value })}
                  onFocus={() => setEditingField(`education.${edu.id}.endDate`)}
                  onBlur={() => setEditingField(null)}
                />
                <FloatingInput
                  label="GPA"
                  value={edu.gpa || ''}
                  onChange={(value) => updateEducation(edu.id, { gpa: value })}
                  onFocus={() => setEditingField(`education.${edu.id}.gpa`)}
                  onBlur={() => setEditingField(null)}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      
      <button
        onClick={addEducation}
        className="w-full py-2 border border-dashed border-black/10 rounded-md text-xs font-mono-ui text-muted-foreground hover:border-[#64748B] hover:text-[#64748B] transition-colors flex items-center justify-center gap-1.5"
      >
        <Plus className="w-3.5 h-3.5" />
        Add Education
      </button>
    </div>
  );
}

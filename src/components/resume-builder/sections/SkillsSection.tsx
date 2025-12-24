import { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function SkillsSection() {
  const { data, addSkill, removeSkill, setEditingField } = useResume();
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = () => {
    const skill = newSkill.trim();
    if (!skill) return;
    addSkill(skill);
    setNewSkill('');
  };

  // Group skills by category
  const groupedSkills = data.skills.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, typeof data.skills>);

  return (
    <div className="space-y-4">
      {Object.entries(groupedSkills).map(([category, skills]) => (
        <div key={category} className="space-y-2">
          <span className="font-mono-ui text-[10px] font-light uppercase tracking-wide text-muted-foreground/60">
            {category}
          </span>
          <div className="flex flex-wrap gap-1.5">
            <AnimatePresence mode="popLayout">
              {skills.map((skill) => (
                <motion.span
                  key={skill.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group inline-flex items-center gap-1 px-2.5 py-1 bg-white/50 border border-black/[0.06] rounded text-xs font-body text-foreground/80"
                >
                  {skill.name}
                  <button
                    onClick={() => removeSkill(skill.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        </div>
      ))}
      
      <div className="flex items-center gap-2 pt-2">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
          onFocus={() => setEditingField('skills')}
          onBlur={() => setEditingField(null)}
          placeholder="Add a skill..."
          className="flex-1 text-xs bg-transparent border-b border-transparent hover:border-black/10 focus:border-[#64748B] focus:outline-none py-1.5 placeholder:text-muted-foreground/40"
        />
        <button
          onClick={handleAddSkill}
          className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

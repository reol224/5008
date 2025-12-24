import { useResume } from '@/contexts/ResumeContext';
import { FloatingInput } from '../FloatingInput';
import { Plus, X, Minus, PlusCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { 
  formatBulletText, 
  analyzeBullet, 
  suggestTenseCorrection,
  getBulletLengthStatus 
} from '@/lib/formatUtils';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function ExperienceSection() {
  const { data, updateExperience, addExperience, removeExperience, setEditingField } = useResume();
  const [newHighlight, setNewHighlight] = useState<{ [key: string]: string }>({});

  const handleAddHighlight = (expId: string) => {
    const rawHighlight = newHighlight[expId]?.trim();
    if (!rawHighlight) return;
    
    // Auto-format the bullet text
    const formattedHighlight = formatBulletText(rawHighlight);
    
    const experience = data.experience.find(exp => exp.id === expId);
    if (experience) {
      updateExperience(expId, {
        highlights: [...experience.highlights, formattedHighlight],
      });
      setNewHighlight(prev => ({ ...prev, [expId]: '' }));
    }
  };

  // Apply formatting suggestion
  const applyTenseSuggestion = (expId: string, index: number, suggestion: string) => {
    const experience = data.experience.find(exp => exp.id === expId);
    if (experience) {
      const newHighlights = [...experience.highlights];
      newHighlights[index] = suggestion;
      updateExperience(expId, { highlights: newHighlights });
    }
  };

  const handleRemoveHighlight = (expId: string, index: number) => {
    const experience = data.experience.find(exp => exp.id === expId);
    if (experience) {
      updateExperience(expId, {
        highlights: experience.highlights.filter((_, i) => i !== index),
      });
    }
  };

  const formatDateRange = (start: string, end: string) => {
    if (!start && !end) return '';
    const formattedStart = start.replace(/-/g, ' – ');
    const formattedEnd = end.replace(/-/g, ' – ');
    return `${formattedStart} – ${formattedEnd}`;
  };

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {data.experience.map((exp) => (
          <motion.div
            key={exp.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="relative p-3 bg-white/30 rounded-md border border-black/[0.04] group"
          >
            <button
              onClick={() => removeExperience(exp.id)}
              className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            
            <div className="space-y-2">
              <FloatingInput
                label="Position"
                value={exp.position}
                onChange={(value) => updateExperience(exp.id, { position: value })}
                onFocus={() => setEditingField(`experience.${exp.id}.position`)}
                onBlur={() => setEditingField(null)}
              />
              <FloatingInput
                label="Company"
                value={exp.company}
                onChange={(value) => updateExperience(exp.id, { company: value })}
                onFocus={() => setEditingField(`experience.${exp.id}.company`)}
                onBlur={() => setEditingField(null)}
              />
              <div className="grid grid-cols-2 gap-2">
                <FloatingInput
                  label="Start Date"
                  value={exp.startDate}
                  onChange={(value) => updateExperience(exp.id, { startDate: value })}
                  onFocus={() => setEditingField(`experience.${exp.id}.startDate`)}
                  onBlur={() => setEditingField(null)}
                />
                <FloatingInput
                  label="End Date"
                  value={exp.endDate}
                  onChange={(value) => updateExperience(exp.id, { endDate: value })}
                  onFocus={() => setEditingField(`experience.${exp.id}.endDate`)}
                  onBlur={() => setEditingField(null)}
                />
              </div>
              <FloatingInput
                label="Description"
                value={exp.description}
                onChange={(value) => updateExperience(exp.id, { description: value })}
                onFocus={() => setEditingField(`experience.${exp.id}.description`)}
                onBlur={() => setEditingField(null)}
                multiline
              />
              
              {/* Highlights */}
              <div className="space-y-1.5 pt-2">
                <span className="font-mono-ui text-[10px] font-light uppercase tracking-wide text-muted-foreground/60">
                  Key Achievements
                </span>
                <AnimatePresence>
                  {exp.highlights.map((highlight, index) => {
                    const issues = analyzeBullet(highlight);
                    const lengthStatus = getBulletLengthStatus(highlight);
                    const tenseSuggestion = suggestTenseCorrection(highlight);
                    const hasIssues = issues.length > 0;
                    
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className={cn(
                          "flex items-start gap-2 group/highlight relative rounded-sm transition-colors",
                          lengthStatus.status === 'error' && "bg-red-50/50 -mx-1 px-1",
                          lengthStatus.status === 'warning' && "bg-amber-50/30 -mx-1 px-1"
                        )}
                      >
                        <span className="text-muted-foreground/40 mt-2">•</span>
                        <span className={cn(
                          "flex-1 text-xs py-1.5",
                          lengthStatus.status === 'error' ? "text-red-700/80" : 
                          lengthStatus.status === 'warning' ? "text-amber-700/80" : 
                          "text-foreground/80"
                        )}>
                          {highlight}
                        </span>
                        
                        {/* Issues indicator */}
                        {hasIssues && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button className="p-1 text-amber-500 hover:text-amber-600 transition-colors">
                                  <AlertTriangle className="w-3 h-3" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="left" className="max-w-xs">
                                <div className="space-y-1.5">
                                  {issues.map((issue, i) => (
                                    <div key={i} className="text-xs">
                                      <span className={cn(
                                        "font-medium",
                                        issue.severity === 'error' ? "text-red-600" : "text-amber-600"
                                      )}>
                                        {issue.type === 'length' && '📏'}
                                        {issue.type === 'tense' && '⏱️'}
                                        {issue.type === 'punctuation' && '✏️'}
                                        {issue.type === 'spacing' && '␣'}
                                      </span>{' '}
                                      {issue.message}
                                    </div>
                                  ))}
                                  {tenseSuggestion && (
                                    <button
                                      onClick={() => applyTenseSuggestion(exp.id, index, tenseSuggestion)}
                                      className="mt-1 text-xs text-blue-600 hover:text-blue-700 underline"
                                    >
                                      Apply: "{tenseSuggestion.slice(0, 30)}..."
                                    </button>
                                  )}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        
                        {/* Length indicator */}
                        {lengthStatus.status !== 'ok' && (
                          <span className={cn(
                            "text-[9px] font-mono tabular-nums",
                            lengthStatus.status === 'error' ? "text-red-500" : "text-amber-500"
                          )}>
                            {lengthStatus.length}/{lengthStatus.max}
                          </span>
                        )}
                        
                        <button
                          onClick={() => handleRemoveHighlight(exp.id, index)}
                          className="p-1 opacity-0 group-hover/highlight:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newHighlight[exp.id] || ''}
                      onChange={(e) => setNewHighlight(prev => ({ ...prev, [exp.id]: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddHighlight(exp.id)}
                      onBlur={() => {
                        // Auto-format on blur
                        const value = newHighlight[exp.id];
                        if (value) {
                          setNewHighlight(prev => ({ ...prev, [exp.id]: formatBulletText(value) }));
                        }
                      }}
                      placeholder="Add achievement..."
                      className={cn(
                        "flex-1 text-xs bg-transparent border-b border-transparent hover:border-black/10 focus:border-[#64748B] focus:outline-none py-1.5 placeholder:text-muted-foreground/40",
                        (newHighlight[exp.id]?.length || 0) > 150 && "text-red-600",
                        (newHighlight[exp.id]?.length || 0) > 120 && (newHighlight[exp.id]?.length || 0) <= 150 && "text-amber-600"
                      )}
                    />
                    <button
                      onClick={() => handleAddHighlight(exp.id)}
                      className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {/* Live character counter */}
                  {(newHighlight[exp.id]?.length || 0) > 80 && (
                    <div className="flex justify-end">
                      <span className={cn(
                        "text-[9px] font-mono tabular-nums transition-colors",
                        (newHighlight[exp.id]?.length || 0) > 150 ? "text-red-500" :
                        (newHighlight[exp.id]?.length || 0) > 120 ? "text-amber-500" :
                        "text-muted-foreground/50"
                      )}>
                        {newHighlight[exp.id]?.length || 0}/150
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      
      <button
        onClick={addExperience}
        className="w-full py-2 border border-dashed border-black/10 rounded-md text-xs font-mono-ui text-muted-foreground hover:border-[#64748B] hover:text-[#64748B] transition-colors flex items-center justify-center gap-1.5"
      >
        <Plus className="w-3.5 h-3.5" />
        Add Experience
      </button>
    </div>
  );
}

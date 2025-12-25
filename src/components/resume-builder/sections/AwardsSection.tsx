import { useResume } from '@/contexts/ResumeContext';
import { X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function AwardsSection() {
  const { 
    data, 
    addAward, 
    removeAward, 
    updateAward,
    setEditingField 
  } = useResume();

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {data.awards.map((award) => (
          <motion.div
            key={award.id}
            layout
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="group relative space-y-2 p-3 bg-white/30 rounded border border-black/[0.04]"
          >
            <button
              onClick={() => removeAward(award.id)}
              className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <input
              type="text"
              value={award.title}
              onChange={(e) => updateAward(award.id, { title: e.target.value })}
              onFocus={() => setEditingField(`awards.${award.id}.title`)}
              onBlur={() => setEditingField(null)}
              placeholder="Award Title"
              className="w-full text-sm font-medium bg-transparent border-b border-transparent hover:border-black/10 focus:border-[#64748B] focus:outline-none py-1 placeholder:text-muted-foreground/40"
            />

            <input
              type="text"
              value={award.issuer}
              onChange={(e) => updateAward(award.id, { issuer: e.target.value })}
              onFocus={() => setEditingField(`awards.${award.id}.issuer`)}
              onBlur={() => setEditingField(null)}
              placeholder="Issuing Organization"
              className="w-full text-xs bg-transparent border-b border-transparent hover:border-black/10 focus:border-[#64748B] focus:outline-none py-1 placeholder:text-muted-foreground/40"
            />

            <input
              type="text"
              value={award.date}
              onChange={(e) => updateAward(award.id, { date: e.target.value })}
              onFocus={() => setEditingField(`awards.${award.id}.date`)}
              onBlur={() => setEditingField(null)}
              placeholder="Date Received"
              className="w-full text-xs bg-transparent border-b border-transparent hover:border-black/10 focus:border-[#64748B] focus:outline-none py-1 placeholder:text-muted-foreground/40"
            />

            <textarea
              value={award.description || ''}
              onChange={(e) => updateAward(award.id, { description: e.target.value })}
              onFocus={() => setEditingField(`awards.${award.id}.description`)}
              onBlur={() => setEditingField(null)}
              placeholder="Description (optional)"
              rows={2}
              className="w-full text-xs bg-transparent border border-transparent hover:border-black/10 focus:border-[#64748B] focus:outline-none py-1 px-0 placeholder:text-muted-foreground/40 resize-none"
            />
          </motion.div>
        ))}
      </AnimatePresence>

      <button
        onClick={addAward}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        Add Award
      </button>
    </div>
  );
}

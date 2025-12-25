import { useResume } from '@/contexts/ResumeContext';
import { X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function PublicationsSection() {
  const { 
    data, 
    addPublication, 
    removePublication, 
    updatePublication,
    setEditingField 
  } = useResume();

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {data.publications.map((pub) => (
          <motion.div
            key={pub.id}
            layout
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="group relative space-y-2 p-3 bg-white/30 rounded border border-black/[0.04]"
          >
            <button
              onClick={() => removePublication(pub.id)}
              className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <input
              type="text"
              value={pub.title}
              onChange={(e) => updatePublication(pub.id, { title: e.target.value })}
              onFocus={() => setEditingField(`publications.${pub.id}.title`)}
              onBlur={() => setEditingField(null)}
              placeholder="Publication Title"
              className="w-full text-sm font-medium bg-transparent border-b border-transparent hover:border-black/10 focus:border-[#64748B] focus:outline-none py-1 placeholder:text-muted-foreground/40"
            />

            <input
              type="text"
              value={pub.publisher}
              onChange={(e) => updatePublication(pub.id, { publisher: e.target.value })}
              onFocus={() => setEditingField(`publications.${pub.id}.publisher`)}
              onBlur={() => setEditingField(null)}
              placeholder="Publisher / Journal"
              className="w-full text-xs bg-transparent border-b border-transparent hover:border-black/10 focus:border-[#64748B] focus:outline-none py-1 placeholder:text-muted-foreground/40"
            />

            <input
              type="text"
              value={pub.date}
              onChange={(e) => updatePublication(pub.id, { date: e.target.value })}
              onFocus={() => setEditingField(`publications.${pub.id}.date`)}
              onBlur={() => setEditingField(null)}
              placeholder="Publication Date"
              className="w-full text-xs bg-transparent border-b border-transparent hover:border-black/10 focus:border-[#64748B] focus:outline-none py-1 placeholder:text-muted-foreground/40"
            />

            <input
              type="text"
              value={pub.url || ''}
              onChange={(e) => updatePublication(pub.id, { url: e.target.value })}
              onFocus={() => setEditingField(`publications.${pub.id}.url`)}
              onBlur={() => setEditingField(null)}
              placeholder="URL (optional)"
              className="w-full text-xs bg-transparent border-b border-transparent hover:border-black/10 focus:border-[#64748B] focus:outline-none py-1 placeholder:text-muted-foreground/40"
            />

            <textarea
              value={pub.description || ''}
              onChange={(e) => updatePublication(pub.id, { description: e.target.value })}
              onFocus={() => setEditingField(`publications.${pub.id}.description`)}
              onBlur={() => setEditingField(null)}
              placeholder="Brief description (optional)"
              rows={2}
              className="w-full text-xs bg-transparent border border-transparent hover:border-black/10 focus:border-[#64748B] focus:outline-none py-1 px-0 placeholder:text-muted-foreground/40 resize-none"
            />
          </motion.div>
        ))}
      </AnimatePresence>

      <button
        onClick={addPublication}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        Add Publication
      </button>
    </div>
  );
}

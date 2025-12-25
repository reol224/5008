import { useResume } from '@/contexts/ResumeContext';
import { X, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CustomSection } from '@/types/resume';

interface CustomSectionEditorProps {
  section: CustomSection;
}

export function CustomSectionEditor({ section }: CustomSectionEditorProps) {
  const { 
    updateCustomSectionTitle,
    addCustomSectionItem, 
    removeCustomSectionItem, 
    updateCustomSectionItem,
    removeCustomSection,
    setEditingField 
  } = useResume();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={section.title}
          onChange={(e) => updateCustomSectionTitle(section.id, e.target.value)}
          onFocus={() => setEditingField(`custom.${section.id}.title`)}
          onBlur={() => setEditingField(null)}
          placeholder="Section Title"
          className="flex-1 text-xs font-medium bg-transparent border-b border-transparent hover:border-black/10 focus:border-[#64748B] focus:outline-none py-1 placeholder:text-muted-foreground/40"
        />
        <button
          onClick={() => removeCustomSection(section.id)}
          className="p-1 text-muted-foreground hover:text-destructive transition-colors"
          title="Remove Section"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <AnimatePresence mode="popLayout">
        {section.items.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="group relative space-y-2 p-3 bg-white/30 rounded border border-black/[0.04]"
          >
            <button
              onClick={() => removeCustomSectionItem(section.id, item.id)}
              className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <input
              type="text"
              value={item.title}
              onChange={(e) => updateCustomSectionItem(section.id, item.id, { title: e.target.value })}
              onFocus={() => setEditingField(`custom.${section.id}.${item.id}.title`)}
              onBlur={() => setEditingField(null)}
              placeholder="Title"
              className="w-full text-sm font-medium bg-transparent border-b border-transparent hover:border-black/10 focus:border-[#64748B] focus:outline-none py-1 placeholder:text-muted-foreground/40"
            />

            <input
              type="text"
              value={item.subtitle || ''}
              onChange={(e) => updateCustomSectionItem(section.id, item.id, { subtitle: e.target.value })}
              onFocus={() => setEditingField(`custom.${section.id}.${item.id}.subtitle`)}
              onBlur={() => setEditingField(null)}
              placeholder="Subtitle (optional)"
              className="w-full text-xs bg-transparent border-b border-transparent hover:border-black/10 focus:border-[#64748B] focus:outline-none py-1 placeholder:text-muted-foreground/40"
            />

            <input
              type="text"
              value={item.date || ''}
              onChange={(e) => updateCustomSectionItem(section.id, item.id, { date: e.target.value })}
              onFocus={() => setEditingField(`custom.${section.id}.${item.id}.date`)}
              onBlur={() => setEditingField(null)}
              placeholder="Date (optional)"
              className="w-full text-xs bg-transparent border-b border-transparent hover:border-black/10 focus:border-[#64748B] focus:outline-none py-1 placeholder:text-muted-foreground/40"
            />

            <textarea
              value={item.description || ''}
              onChange={(e) => updateCustomSectionItem(section.id, item.id, { description: e.target.value })}
              onFocus={() => setEditingField(`custom.${section.id}.${item.id}.description`)}
              onBlur={() => setEditingField(null)}
              placeholder="Description (optional)"
              rows={2}
              className="w-full text-xs bg-transparent border border-transparent hover:border-black/10 focus:border-[#64748B] focus:outline-none py-1 px-0 placeholder:text-muted-foreground/40 resize-none"
            />
          </motion.div>
        ))}
      </AnimatePresence>

      <button
        onClick={() => addCustomSectionItem(section.id)}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        Add Item
      </button>
    </div>
  );
}

import { useResume } from '@/contexts/ResumeContext';
import { TemplateType } from '@/types/resume';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutTemplate, X } from 'lucide-react';

interface TemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

const templates: { id: TemplateType; name: string; description: string }[] = [
  { id: 'classic', name: 'Classic', description: 'Traditional centered layout' },
  { id: 'modern', name: 'Modern', description: 'Bold header with accents' },
  { id: 'minimal', name: 'Minimal', description: 'Clean, typography-focused' },
  { id: 'two-column', name: 'Two Column', description: 'Efficient side-by-side layout' },
];

export function TemplateSelector({ isOpen, onClose }: TemplateSelectorProps) {
  const { template, setTemplate } = useResume();

  const handleSelect = (id: TemplateType) => {
    setTemplate(id);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 z-40"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.06]">
              <div className="flex items-center gap-2">
                <LayoutTemplate className="w-4 h-4 text-[#64748B]" />
                <h2 className="font-display text-sm font-bold text-foreground">Templates</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded hover:bg-black/5 transition-colors text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-3">
                {templates.map((t, index) => (
                  <motion.button
                    key={t.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleSelect(t.id)}
                    className={cn(
                      "w-full text-left p-4 rounded-lg border transition-all duration-200",
                      template === t.id
                        ? "border-[#64748B] bg-[#64748B]/5"
                        : "border-black/[0.06] hover:border-black/10 hover:bg-black/[0.02]"
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-body font-medium text-sm text-foreground">
                        {t.name}
                      </span>
                      {template === t.id && (
                        <span className="text-[10px] font-mono-ui uppercase tracking-wider text-[#64748B]">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="font-mono-ui text-xs font-light text-muted-foreground">
                      {t.description}
                    </p>
                    
                    {/* Mini preview */}
                    <div className="mt-3 bg-[#F5F5F4] rounded p-2 aspect-[1/1.414] flex items-start justify-center">
                      <TemplatePreview type={t.id} />
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function TemplatePreview({ type }: { type: TemplateType }) {
  switch (type) {
    case 'classic':
      return (
        <div className="w-full p-2 space-y-1.5">
          <div className="h-3 bg-[#1A1A1A]/20 rounded w-1/2 mx-auto" />
          <div className="h-1.5 bg-[#64748B]/30 rounded w-1/3 mx-auto" />
          <div className="h-0.5 bg-[#1A1A1A]/10 rounded w-2/3 mx-auto mt-2" />
          <div className="space-y-1 mt-3">
            <div className="h-1 bg-[#1A1A1A]/15 rounded w-full" />
            <div className="h-1 bg-[#1A1A1A]/15 rounded w-5/6" />
            <div className="h-1 bg-[#1A1A1A]/15 rounded w-4/5" />
          </div>
        </div>
      );
    case 'modern':
      return (
        <div className="w-full">
          <div className="bg-[#1A1A1A] p-2 rounded-t space-y-1">
            <div className="h-2.5 bg-white/30 rounded w-1/2" />
            <div className="h-1 bg-white/20 rounded w-1/3" />
          </div>
          <div className="p-2 space-y-2">
            <div className="flex items-center gap-1">
              <div className="w-0.5 h-2 bg-[#64748B] rounded" />
              <div className="h-1 bg-[#1A1A1A]/15 rounded w-1/4" />
            </div>
            <div className="h-1 bg-[#1A1A1A]/10 rounded w-full ml-1.5" />
          </div>
        </div>
      );
    case 'minimal':
      return (
        <div className="w-full p-2 space-y-2">
          <div className="h-4 bg-[#1A1A1A]/25 rounded w-2/3" />
          <div className="h-1.5 bg-[#1A1A1A]/10 rounded w-1/2" />
          <div className="h-0.5 bg-transparent rounded w-full" />
          <div className="space-y-1">
            <div className="h-0.5 bg-[#1A1A1A]/10 rounded w-full" />
            <div className="h-0.5 bg-[#1A1A1A]/10 rounded w-5/6" />
          </div>
        </div>
      );
    case 'two-column':
      return (
        <div className="w-full p-2">
          <div className="border-b border-[#1A1A1A]/10 pb-1.5 mb-1.5">
            <div className="h-2 bg-[#1A1A1A]/20 rounded w-1/2" />
            <div className="h-1 bg-[#64748B]/30 rounded w-1/3 mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <div className="h-0.5 bg-[#1A1A1A]/15 rounded w-full" />
              <div className="h-0.5 bg-[#1A1A1A]/15 rounded w-5/6" />
            </div>
            <div className="border-l border-[#1A1A1A]/5 pl-2 space-y-1">
              <div className="h-0.5 bg-[#1A1A1A]/15 rounded w-full" />
              <div className="h-0.5 bg-[#1A1A1A]/15 rounded w-4/5" />
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
}

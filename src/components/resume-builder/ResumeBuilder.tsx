import { useState } from 'react';
import { ResumeProvider } from '@/contexts/ResumeContext';
import { EditorPane } from './EditorPane';
import { PreviewPane } from './PreviewPane';
import { TemplateSelector } from './TemplateSelector';
import { ExportButton } from './ExportButton';
import { LayoutTemplate, PenLine, Eye } from 'lucide-react';
import { 
  ResizableHandle, 
  ResizablePanel, 
  ResizablePanelGroup 
} from '@/components/ui/resizable';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

type MobileTab = 'editor' | 'preview';

function ResumeBuilderContent() {
  const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<MobileTab>('editor');
  const isMobile = useIsMobile();

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#FAFAF9]">
      {/* Top Bar */}
      <header className="h-12 md:h-14 border-b border-black/[0.06] bg-white/80 backdrop-blur-sm flex items-center justify-between px-3 md:px-6 z-20 relative">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-7 h-7 md:w-8 md:h-8 bg-[#1A1A1A] rounded-md flex items-center justify-center">
            <span className="font-display text-white text-xs md:text-sm font-bold">R</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="font-display text-sm font-bold text-[#1A1A1A]">Resume Builder</h1>
            <p className="font-mono-ui text-[10px] font-light text-muted-foreground tracking-wide">
              Swiss precision, zero clutter
            </p>
          </div>
          <h1 className="sm:hidden font-display text-sm font-bold text-[#1A1A1A]">Resume</h1>
        </div>
        
        <button
          onClick={() => setIsTemplateSelectorOpen(true)}
          className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 rounded-md border border-black/[0.08] hover:border-black/15 hover:bg-black/[0.02] transition-colors"
        >
          <LayoutTemplate className="w-4 h-4 text-[#64748B]" />
          <span className="font-mono-ui text-xs text-muted-foreground hidden sm:inline">Templates</span>
        </button>
      </header>

      {/* Main Content - Desktop */}
      {!isMobile && (
        <div className="h-[calc(100vh-3.5rem)]">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={35} minSize={25} maxSize={50}>
              <EditorPane />
            </ResizablePanel>
            <ResizableHandle withHandle className="w-px bg-black/[0.06] hover:bg-[#64748B]/30 transition-colors" />
            <ResizablePanel defaultSize={65}>
              <PreviewPane />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      )}

      {/* Main Content - Mobile */}
      {isMobile && (
        <div className="h-[calc(100vh-3rem-3.5rem)] overflow-hidden">
          {activeTab === 'editor' ? <EditorPane /> : <PreviewPane />}
        </div>
      )}

      {/* Mobile Tab Bar */}
      {isMobile && (
        <nav className="h-14 border-t border-black/[0.06] bg-white/95 backdrop-blur-sm flex items-center justify-around px-4 fixed bottom-0 left-0 right-0 z-30">
          <button
            onClick={() => setActiveTab('editor')}
            className={cn(
              "flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-colors",
              activeTab === 'editor' 
                ? "text-[#1A1A1A] bg-black/5" 
                : "text-muted-foreground"
            )}
          >
            <PenLine className="w-5 h-5" />
            <span className="font-mono-ui text-[10px] font-medium">Edit</span>
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={cn(
              "flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-colors",
              activeTab === 'preview' 
                ? "text-[#1A1A1A] bg-black/5" 
                : "text-muted-foreground"
            )}
          >
            <Eye className="w-5 h-5" />
            <span className="font-mono-ui text-[10px] font-medium">Preview</span>
          </button>
        </nav>
      )}

      {/* Template Selector Drawer */}
      <TemplateSelector 
        isOpen={isTemplateSelectorOpen} 
        onClose={() => setIsTemplateSelectorOpen(false)} 
      />

      {/* Export Button */}
      <ExportButton />

      {/* Print styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .a4-ratio, .a4-ratio * {
            visibility: visible;
          }
          .a4-ratio {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: auto;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export function ResumeBuilder() {
  return (
    <ResumeProvider>
      <ResumeBuilderContent />
    </ResumeProvider>
  );
}

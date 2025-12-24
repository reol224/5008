import { useState } from 'react';
import { ResumeProvider } from '@/contexts/ResumeContext';
import { EditorPane } from './EditorPane';
import { PreviewPane } from './PreviewPane';
import { TemplateSelector } from './TemplateSelector';
import { ExportButton } from './ExportButton';
import { LayoutTemplate } from 'lucide-react';
import { 
  ResizableHandle, 
  ResizablePanel, 
  ResizablePanelGroup 
} from '@/components/ui/resizable';

function ResumeBuilderContent() {
  const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = useState(false);

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#FAFAF9]">
      {/* Top Bar */}
      <header className="h-14 border-b border-black/[0.06] bg-white/80 backdrop-blur-sm flex items-center justify-between px-6 z-20 relative">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#1A1A1A] rounded-md flex items-center justify-center">
            <span className="font-display text-white text-sm font-bold">R</span>
          </div>
          <div>
            <h1 className="font-display text-sm font-bold text-[#1A1A1A]">Resume Builder</h1>
            <p className="font-mono-ui text-[10px] font-light text-muted-foreground tracking-wide">
              Swiss precision, zero clutter
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setIsTemplateSelectorOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-black/[0.08] hover:border-black/15 hover:bg-black/[0.02] transition-colors"
        >
          <LayoutTemplate className="w-4 h-4 text-[#64748B]" />
          <span className="font-mono-ui text-xs text-muted-foreground">Templates</span>
        </button>
      </header>

      {/* Main Content */}
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

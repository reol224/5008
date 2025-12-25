import { useResume } from '@/contexts/ResumeContext';
import { ClassicTemplate } from './templates/ClassicTemplate';
import { ModernTemplate } from './templates/ModernTemplate';
import { MinimalTemplate } from './templates/MinimalTemplate';
import { TwoColumnTemplate } from './templates/TwoColumnTemplate';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function PreviewPane() {
  const { template, zoom, setZoom } = useResume();

  const handleZoomIn = () => setZoom(Math.min(zoom + 10, 150));
  const handleZoomOut = () => setZoom(Math.max(zoom - 10, 50));
  const handleFit = () => setZoom(100);

  const getTemplate = () => {
    switch (template) {
      case 'classic':
        return <ClassicTemplate />;
      case 'modern':
        return <ModernTemplate />;
      case 'minimal':
        return <MinimalTemplate />;
      case 'two-column':
        return <TwoColumnTemplate />;
      default:
        return <ClassicTemplate />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#E8E8E6]">
      {/* Zoom Controls */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-black/[0.06]">
        <span className="font-mono-ui text-xs font-light text-muted-foreground">
          Preview
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded hover:bg-black/5 transition-colors text-muted-foreground"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="font-mono-ui text-xs text-muted-foreground min-w-[3rem] text-center">
            {zoom}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded hover:bg-black/5 transition-colors text-muted-foreground"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-black/10 mx-1" />
          <button
            onClick={handleFit}
            className="p-1.5 rounded hover:bg-black/5 transition-colors text-muted-foreground"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-auto p-8 flex items-start justify-center">
        <motion.div
          animate={{ scale: zoom / 100 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="origin-top"
        >
          <div 
            className={cn(
              "w-[595px] bg-white shadow-lg a4-ratio overflow-y-auto",
              "paper-texture"
            )}
            style={{
              backgroundImage: `
                linear-gradient(to bottom, rgba(250,250,249,0.03), rgba(245,245,244,0.03)),
                url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")
              `,
              backgroundBlendMode: 'overlay',
            }}
          >
            {getTemplate()}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

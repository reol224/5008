import { useState } from 'react';
import { Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function ExportButton() {
  const [isExporting, setIsExporting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real implementation, you would use a library like html2pdf.js or jsPDF
    // For now, we'll trigger print dialog which can save as PDF
    window.print();
    
    setIsExporting(false);
    setShowSuccess(true);
    
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <motion.button
      onClick={handleExport}
      disabled={isExporting}
      animate={{
        opacity: isExporting ? 0.7 : [0.95, 1, 0.95],
      }}
      transition={{
        opacity: {
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }}
      className={cn(
        "fixed bottom-8 right-8 z-30",
        "flex items-center gap-2 px-5 py-3 rounded-full",
        "bg-[#1A1A1A] text-white shadow-lg",
        "hover:bg-[#2A2A2A] transition-colors",
        "font-body text-sm font-medium",
        "disabled:cursor-not-allowed"
      )}
    >
      {isExporting ? (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full"
          />
          Exporting...
        </>
      ) : showSuccess ? (
        <>
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-green-400"
          >
            ✓
          </motion.span>
          Done!
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          Export PDF
        </>
      )}
    </motion.button>
  );
}

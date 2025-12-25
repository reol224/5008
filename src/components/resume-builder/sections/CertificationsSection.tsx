import { useResume } from '@/contexts/ResumeContext';
import { X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function CertificationsSection() {
  const { 
    data, 
    addCertification, 
    removeCertification, 
    updateCertification,
    setEditingField 
  } = useResume();

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {data.certifications.map((cert) => (
          <motion.div
            key={cert.id}
            layout
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="group relative space-y-2 p-3 bg-white/30 rounded border border-black/[0.04]"
          >
            <button
              onClick={() => removeCertification(cert.id)}
              className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <input
              type="text"
              value={cert.name}
              onChange={(e) => updateCertification(cert.id, { name: e.target.value })}
              onFocus={() => setEditingField(`certifications.${cert.id}.name`)}
              onBlur={() => setEditingField(null)}
              placeholder="Certification Name"
              className="w-full text-sm font-medium bg-transparent border-b border-transparent hover:border-black/10 focus:border-[#64748B] focus:outline-none py-1 placeholder:text-muted-foreground/40"
            />

            <input
              type="text"
              value={cert.issuer}
              onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })}
              onFocus={() => setEditingField(`certifications.${cert.id}.issuer`)}
              onBlur={() => setEditingField(null)}
              placeholder="Issuing Organization"
              className="w-full text-xs bg-transparent border-b border-transparent hover:border-black/10 focus:border-[#64748B] focus:outline-none py-1 placeholder:text-muted-foreground/40"
            />

            <div className="flex gap-2">
              <input
                type="text"
                value={cert.date}
                onChange={(e) => updateCertification(cert.id, { date: e.target.value })}
                onFocus={() => setEditingField(`certifications.${cert.id}.date`)}
                onBlur={() => setEditingField(null)}
                placeholder="Issue Date"
                className="flex-1 text-xs bg-transparent border-b border-transparent hover:border-black/10 focus:border-[#64748B] focus:outline-none py-1 placeholder:text-muted-foreground/40"
              />
              <input
                type="text"
                value={cert.expiryDate || ''}
                onChange={(e) => updateCertification(cert.id, { expiryDate: e.target.value })}
                onFocus={() => setEditingField(`certifications.${cert.id}.expiryDate`)}
                onBlur={() => setEditingField(null)}
                placeholder="Expiry Date (optional)"
                className="flex-1 text-xs bg-transparent border-b border-transparent hover:border-black/10 focus:border-[#64748B] focus:outline-none py-1 placeholder:text-muted-foreground/40"
              />
            </div>

            <input
              type="text"
              value={cert.credentialId || ''}
              onChange={(e) => updateCertification(cert.id, { credentialId: e.target.value })}
              onFocus={() => setEditingField(`certifications.${cert.id}.credentialId`)}
              onBlur={() => setEditingField(null)}
              placeholder="Credential ID (optional)"
              className="w-full text-xs bg-transparent border-b border-transparent hover:border-black/10 focus:border-[#64748B] focus:outline-none py-1 placeholder:text-muted-foreground/40"
            />
          </motion.div>
        ))}
      </AnimatePresence>

      <button
        onClick={addCertification}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        Add Certification
      </button>
    </div>
  );
}

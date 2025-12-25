import { useResume } from '@/contexts/ResumeContext';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function ClassicTemplate() {
  const { data, sections, editingField } = useResume();

  const visibleSections = sections.filter(s => s.visible).sort((a, b) => a.order - b.order);

  const isEditing = (field: string) => editingField === field;

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'contact':
        return (
          <header className="text-center mb-8">
            <motion.h1 
              className={cn(
                "font-display text-4xl font-bold text-[#1A1A1A] mb-1 tracking-tight transition-all duration-150",
                isEditing('contact.fullName') && "ring-2 ring-[#64748B]/30 ring-offset-2 rounded"
              )}
            >
              {data.contact.fullName || 'Your Name'}
            </motion.h1>
            <p className={cn(
              "font-body text-lg text-[#64748B] mb-4 transition-all duration-150",
              isEditing('contact.title') && "ring-2 ring-[#64748B]/30 ring-offset-2 rounded"
            )}>
              {data.contact.title || 'Professional Title'}
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-[#1A1A1A]/70 font-body">
              {data.contact.email && (
                <span className={cn(
                  "transition-all duration-150",
                  isEditing('contact.email') && "ring-2 ring-[#64748B]/30 ring-offset-1 rounded px-1"
                )}>
                  {data.contact.email}
                </span>
              )}
              {data.contact.phone && (
                <>
                  <span className="text-[#64748B]/40">•</span>
                  <span className={cn(
                    "transition-all duration-150",
                    isEditing('contact.phone') && "ring-2 ring-[#64748B]/30 ring-offset-1 rounded px-1"
                  )}>
                    {data.contact.phone}
                  </span>
                </>
              )}
              {data.contact.location && (
                <>
                  <span className="text-[#64748B]/40">•</span>
                  <span className={cn(
                    "transition-all duration-150",
                    isEditing('contact.location') && "ring-2 ring-[#64748B]/30 ring-offset-1 rounded px-1"
                  )}>
                    {data.contact.location}
                  </span>
                </>
              )}
            </div>
            {(data.contact.linkedin || data.contact.website) && (
              <div className="flex items-center justify-center gap-4 text-sm text-[#64748B] font-body mt-1">
                {data.contact.linkedin && (
                  <span className={cn(
                    "transition-all duration-150",
                    isEditing('contact.linkedin') && "ring-2 ring-[#64748B]/30 ring-offset-1 rounded px-1"
                  )}>
                    {data.contact.linkedin}
                  </span>
                )}
                {data.contact.website && (
                  <>
                    {data.contact.linkedin && <span className="text-[#64748B]/40">•</span>}
                    <span className={cn(
                      "transition-all duration-150",
                      isEditing('contact.website') && "ring-2 ring-[#64748B]/30 ring-offset-1 rounded px-1"
                    )}>
                      {data.contact.website}
                    </span>
                  </>
                )}
              </div>
            )}
          </header>
        );

      case 'summary':
        return data.summary ? (
          <section className="mb-6">
            <h2 className="font-display text-sm font-bold uppercase tracking-widest text-[#64748B] mb-3 border-b border-[#1A1A1A]/10 pb-2">
              Summary
            </h2>
            <p className={cn(
              "font-body text-sm text-[#1A1A1A]/80 leading-relaxed transition-all duration-150",
              isEditing('summary') && "ring-2 ring-[#64748B]/30 ring-offset-2 rounded p-1"
            )}>
              {data.summary}
            </p>
          </section>
        ) : null;

      case 'experience':
        return data.experience.length > 0 ? (
          <section className="mb-6">
            <h2 className="font-display text-sm font-bold uppercase tracking-widest text-[#64748B] mb-3 border-b border-[#1A1A1A]/10 pb-2">
              Experience
            </h2>
            <div className="space-y-4">
              {data.experience.map((exp) => (
                <div key={exp.id} className="group">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className={cn(
                        "font-body font-semibold text-[#1A1A1A] transition-all duration-150",
                        isEditing(`experience.${exp.id}.position`) && "ring-2 ring-[#64748B]/30 ring-offset-1 rounded px-1"
                      )}>
                        {exp.position || 'Position Title'}
                      </h3>
                      <p className={cn(
                        "font-body text-sm text-[#64748B] transition-all duration-150",
                        isEditing(`experience.${exp.id}.company`) && "ring-2 ring-[#64748B]/30 ring-offset-1 rounded px-1"
                      )}>
                        {exp.company || 'Company Name'}
                      </p>
                    </div>
                    <span className={cn(
                      "font-mono-ui text-xs text-[#1A1A1A]/50 transition-all duration-150",
                      (isEditing(`experience.${exp.id}.startDate`) || isEditing(`experience.${exp.id}.endDate`)) && "ring-2 ring-[#64748B]/30 ring-offset-1 rounded px-1"
                    )}>
                      {exp.startDate} – {exp.endDate}
                    </span>
                  </div>
                  {exp.description && (
                    <p className={cn(
                      "font-body text-sm text-[#1A1A1A]/70 mb-2 transition-all duration-150",
                      isEditing(`experience.${exp.id}.description`) && "ring-2 ring-[#64748B]/30 ring-offset-1 rounded px-1"
                    )}>
                      {exp.description}
                    </p>
                  )}
                  {exp.highlights.length > 0 && (
                    <ul className="space-y-1">
                      {exp.highlights.map((highlight, idx) => (
                        <li key={idx} className="font-body text-sm text-[#1A1A1A]/70 flex">
                          <span className="text-[#64748B] mr-2">•</span>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        ) : null;

      case 'education':
        return data.education.length > 0 ? (
          <section className="mb-6">
            <h2 className="font-display text-sm font-bold uppercase tracking-widest text-[#64748B] mb-3 border-b border-[#1A1A1A]/10 pb-2">
              Education
            </h2>
            <div className="space-y-3">
              {data.education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-start">
                  <div>
                    <h3 className={cn(
                      "font-body font-semibold text-[#1A1A1A] transition-all duration-150",
                      isEditing(`education.${edu.id}.institution`) && "ring-2 ring-[#64748B]/30 ring-offset-1 rounded px-1"
                    )}>
                      {edu.institution || 'Institution'}
                    </h3>
                    <p className="font-body text-sm text-[#64748B]">
                      <span className={cn(
                        "transition-all duration-150",
                        isEditing(`education.${edu.id}.degree`) && "ring-2 ring-[#64748B]/30 ring-offset-1 rounded px-1"
                      )}>
                        {edu.degree}
                      </span>
                      {edu.field && (
                        <>
                          {' in '}
                          <span className={cn(
                            "transition-all duration-150",
                            isEditing(`education.${edu.id}.field`) && "ring-2 ring-[#64748B]/30 ring-offset-1 rounded px-1"
                          )}>
                            {edu.field}
                          </span>
                        </>
                      )}
                      {edu.gpa && (
                        <span className={cn(
                          "ml-2 text-[#1A1A1A]/50 transition-all duration-150",
                          isEditing(`education.${edu.id}.gpa`) && "ring-2 ring-[#64748B]/30 ring-offset-1 rounded px-1"
                        )}>
                          GPA: {edu.gpa}
                        </span>
                      )}
                    </p>
                  </div>
                  <span className="font-mono-ui text-xs text-[#1A1A1A]/50">
                    {edu.startDate} – {edu.endDate}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ) : null;

      case 'skills':
        return data.skills.length > 0 ? (
          <section>
            <h2 className="font-display text-sm font-bold uppercase tracking-widest text-[#64748B] mb-3 border-b border-[#1A1A1A]/10 pb-2">
              Skills
            </h2>
            <div className={cn(
              "flex flex-wrap gap-2 transition-all duration-150",
              isEditing('skills') && "ring-2 ring-[#64748B]/30 ring-offset-2 rounded p-1"
            )}>
              {data.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="font-body text-sm text-[#1A1A1A]/80 bg-[#F5F5F4] px-3 py-1 rounded"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        ) : null;

      case 'certifications':
        return data.certifications.length > 0 ? (
          <section className="mb-6">
            <h2 className="font-display text-sm font-bold uppercase tracking-widest text-[#64748B] mb-3 border-b border-[#1A1A1A]/10 pb-2">
              Certifications
            </h2>
            <div className="space-y-3">
              {data.certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between items-start">
                  <div>
                    <h3 className={cn(
                      "font-body font-semibold text-[#1A1A1A] transition-all duration-150",
                      isEditing(`certifications.${cert.id}.name`) && "ring-2 ring-[#64748B]/30 ring-offset-1 rounded px-1"
                    )}>
                      {cert.name || 'Certification Name'}
                    </h3>
                    <p className={cn(
                      "font-body text-sm text-[#64748B] transition-all duration-150",
                      isEditing(`certifications.${cert.id}.issuer`) && "ring-2 ring-[#64748B]/30 ring-offset-1 rounded px-1"
                    )}>
                      {cert.issuer || 'Issuing Organization'}
                    </p>
                    {cert.credentialId && (
                      <p className="font-mono-ui text-xs text-[#1A1A1A]/50">
                        ID: {cert.credentialId}
                      </p>
                    )}
                  </div>
                  <span className="font-mono-ui text-xs text-[#1A1A1A]/50">
                    {cert.date}
                    {cert.expiryDate && ` – ${cert.expiryDate}`}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ) : null;

      case 'publications':
        return data.publications.length > 0 ? (
          <section className="mb-6">
            <h2 className="font-display text-sm font-bold uppercase tracking-widest text-[#64748B] mb-3 border-b border-[#1A1A1A]/10 pb-2">
              Publications
            </h2>
            <div className="space-y-3">
              {data.publications.map((pub) => (
                <div key={pub.id}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={cn(
                      "font-body font-semibold text-[#1A1A1A] transition-all duration-150",
                      isEditing(`publications.${pub.id}.title`) && "ring-2 ring-[#64748B]/30 ring-offset-1 rounded px-1"
                    )}>
                      {pub.title || 'Publication Title'}
                    </h3>
                    <span className="font-mono-ui text-xs text-[#1A1A1A]/50">
                      {pub.date}
                    </span>
                  </div>
                  <p className={cn(
                    "font-body text-sm text-[#64748B] transition-all duration-150",
                    isEditing(`publications.${pub.id}.publisher`) && "ring-2 ring-[#64748B]/30 ring-offset-1 rounded px-1"
                  )}>
                    {pub.publisher || 'Publisher'}
                  </p>
                  {pub.description && (
                    <p className="font-body text-sm text-[#1A1A1A]/70 mt-1">
                      {pub.description}
                    </p>
                  )}
                  {pub.url && (
                    <p className="font-mono-ui text-xs text-[#64748B] mt-1">
                      {pub.url}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ) : null;

      case 'awards':
        return data.awards.length > 0 ? (
          <section className="mb-6">
            <h2 className="font-display text-sm font-bold uppercase tracking-widest text-[#64748B] mb-3 border-b border-[#1A1A1A]/10 pb-2">
              Awards
            </h2>
            <div className="space-y-3">
              {data.awards.map((award) => (
                <div key={award.id}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={cn(
                      "font-body font-semibold text-[#1A1A1A] transition-all duration-150",
                      isEditing(`awards.${award.id}.title`) && "ring-2 ring-[#64748B]/30 ring-offset-1 rounded px-1"
                    )}>
                      {award.title || 'Award Title'}
                    </h3>
                    <span className="font-mono-ui text-xs text-[#1A1A1A]/50">
                      {award.date}
                    </span>
                  </div>
                  <p className={cn(
                    "font-body text-sm text-[#64748B] transition-all duration-150",
                    isEditing(`awards.${award.id}.issuer`) && "ring-2 ring-[#64748B]/30 ring-offset-1 rounded px-1"
                  )}>
                    {award.issuer || 'Issuing Organization'}
                  </p>
                  {award.description && (
                    <p className="font-body text-sm text-[#1A1A1A]/70 mt-1">
                      {award.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ) : null;

      default:
        // Handle custom sections
        if (sectionId.startsWith('custom-')) {
          const customSection = data.customSections.find(s => s.id === sectionId);
          if (customSection && customSection.items.length > 0) {
            return (
              <section className="mb-6">
                <h2 className="font-display text-sm font-bold uppercase tracking-widest text-[#64748B] mb-3 border-b border-[#1A1A1A]/10 pb-2">
                  {customSection.title}
                </h2>
                <div className="space-y-3">
                  {customSection.items.map((item) => (
                    <div key={item.id}>
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="font-body font-semibold text-[#1A1A1A]">
                            {item.title || 'Item Title'}
                          </h3>
                          {item.subtitle && (
                            <p className="font-body text-sm text-[#64748B]">
                              {item.subtitle}
                            </p>
                          )}
                        </div>
                        {item.date && (
                          <span className="font-mono-ui text-xs text-[#1A1A1A]/50">
                            {item.date}
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="font-body text-sm text-[#1A1A1A]/70">
                          {item.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          }
        }
        return null;
    }
  };

  return (
    <div className="p-12 min-h-full">
      {visibleSections.map((section) => (
        <div key={section.id}>
          {renderSection(section.id)}
        </div>
      ))}
    </div>
  );
}

import { useResume } from '@/contexts/ResumeContext';
import { cn } from '@/lib/utils';

export function MinimalTemplate() {
  const { data, sections, editingField } = useResume();

  const visibleSections = sections.filter(s => s.visible).sort((a, b) => a.order - b.order);
  const isEditing = (field: string) => editingField === field;

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'contact':
        return (
          <header className="mb-10">
            <h1 className={cn(
              "font-display text-5xl font-bold text-[#1A1A1A] mb-2 tracking-tighter transition-all duration-150",
              isEditing('contact.fullName') && "ring-2 ring-[#64748B]/30 ring-offset-2 rounded"
            )}>
              {data.contact.fullName || 'Your Name'}
            </h1>
            <p className={cn(
              "font-body text-xl text-[#1A1A1A]/50 mb-6 transition-all duration-150",
              isEditing('contact.title') && "ring-2 ring-[#64748B]/30 ring-offset-2 rounded"
            )}>
              {data.contact.title || 'Professional Title'}
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-[#1A1A1A]/60 font-mono-ui font-light">
              {data.contact.email && <span>{data.contact.email}</span>}
              {data.contact.phone && <span>{data.contact.phone}</span>}
              {data.contact.location && <span>{data.contact.location}</span>}
            </div>
          </header>
        );

      case 'summary':
        return data.summary ? (
          <section className="mb-8">
            <p className={cn(
              "font-body text-base text-[#1A1A1A]/70 leading-relaxed transition-all duration-150",
              isEditing('summary') && "ring-2 ring-[#64748B]/30 ring-offset-2 rounded"
            )}>
              {data.summary}
            </p>
          </section>
        ) : null;

      case 'experience':
        return data.experience.length > 0 ? (
          <section className="mb-8">
            <h2 className="font-mono-ui text-[10px] font-light uppercase tracking-[0.2em] text-[#1A1A1A]/40 mb-5">
              Experience
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="mb-2">
                    <h3 className="font-body font-medium text-[#1A1A1A] text-base">
                      {exp.position || 'Position Title'}
                    </h3>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-[#1A1A1A]/60">{exp.company || 'Company Name'}</span>
                      <span className="text-[#1A1A1A]/20">—</span>
                      <span className="font-mono-ui text-xs text-[#1A1A1A]/40">
                        {exp.startDate} – {exp.endDate}
                      </span>
                    </div>
                  </div>
                  {exp.highlights.length > 0 && (
                    <ul className="space-y-1">
                      {exp.highlights.map((highlight, idx) => (
                        <li key={idx} className="font-body text-sm text-[#1A1A1A]/60 pl-3 border-l border-[#1A1A1A]/10">
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
          <section className="mb-8">
            <h2 className="font-mono-ui text-[10px] font-light uppercase tracking-[0.2em] text-[#1A1A1A]/40 mb-5">
              Education
            </h2>
            <div className="space-y-3">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <h3 className="font-body font-medium text-[#1A1A1A] text-sm">
                    {edu.degree}{edu.field && `, ${edu.field}`}
                  </h3>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-[#1A1A1A]/60">{edu.institution}</span>
                    <span className="font-mono-ui text-xs text-[#1A1A1A]/40">
                      {edu.endDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null;

      case 'skills':
        return data.skills.length > 0 ? (
          <section>
            <h2 className="font-mono-ui text-[10px] font-light uppercase tracking-[0.2em] text-[#1A1A1A]/40 mb-4">
              Skills
            </h2>
            <p className="font-body text-sm text-[#1A1A1A]/60">
              {data.skills.map(s => s.name).join(' · ')}
            </p>
          </section>
        ) : null;

      case 'certifications':
        return data.certifications.length > 0 ? (
          <section className="mb-8">
            <h2 className="font-mono-ui text-[10px] font-light uppercase tracking-[0.2em] text-[#1A1A1A]/40 mb-5">
              Certifications
            </h2>
            <div className="space-y-3">
              {data.certifications.map((cert) => (
                <div key={cert.id}>
                  <h3 className="font-body font-medium text-[#1A1A1A] text-sm">
                    {cert.name || 'Certification Name'}
                  </h3>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-[#1A1A1A]/60">{cert.issuer}</span>
                    <span className="font-mono-ui text-xs text-[#1A1A1A]/40">
                      {cert.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null;

      case 'publications':
        return data.publications.length > 0 ? (
          <section className="mb-8">
            <h2 className="font-mono-ui text-[10px] font-light uppercase tracking-[0.2em] text-[#1A1A1A]/40 mb-5">
              Publications
            </h2>
            <div className="space-y-3">
              {data.publications.map((pub) => (
                <div key={pub.id}>
                  <h3 className="font-body font-medium text-[#1A1A1A] text-sm">
                    {pub.title || 'Publication Title'}
                  </h3>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-[#1A1A1A]/60">{pub.publisher}</span>
                    <span className="font-mono-ui text-xs text-[#1A1A1A]/40">
                      {pub.date}
                    </span>
                  </div>
                  {pub.description && (
                    <p className="font-body text-sm text-[#1A1A1A]/50 mt-1">{pub.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ) : null;

      case 'awards':
        return data.awards.length > 0 ? (
          <section className="mb-8">
            <h2 className="font-mono-ui text-[10px] font-light uppercase tracking-[0.2em] text-[#1A1A1A]/40 mb-5">
              Awards
            </h2>
            <div className="space-y-3">
              {data.awards.map((award) => (
                <div key={award.id}>
                  <h3 className="font-body font-medium text-[#1A1A1A] text-sm">
                    {award.title || 'Award Title'}
                  </h3>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-[#1A1A1A]/60">{award.issuer}</span>
                    <span className="font-mono-ui text-xs text-[#1A1A1A]/40">
                      {award.date}
                    </span>
                  </div>
                  {award.description && (
                    <p className="font-body text-sm text-[#1A1A1A]/50 mt-1">{award.description}</p>
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
              <section className="mb-8">
                <h2 className="font-mono-ui text-[10px] font-light uppercase tracking-[0.2em] text-[#1A1A1A]/40 mb-5">
                  {customSection.title}
                </h2>
                <div className="space-y-3">
                  {customSection.items.map((item) => (
                    <div key={item.id}>
                      <h3 className="font-body font-medium text-[#1A1A1A] text-sm">
                        {item.title || 'Item Title'}
                      </h3>
                      {(item.subtitle || item.date) && (
                        <div className="flex items-center gap-2 text-sm">
                          {item.subtitle && <span className="text-[#1A1A1A]/60">{item.subtitle}</span>}
                          {item.date && (
                            <span className="font-mono-ui text-xs text-[#1A1A1A]/40">
                              {item.date}
                            </span>
                          )}
                        </div>
                      )}
                      {item.description && (
                        <p className="font-body text-sm text-[#1A1A1A]/50 mt-1">{item.description}</p>
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
    <div className="p-14 min-h-full">
      {visibleSections.map((section) => (
        <div key={section.id}>
          {renderSection(section.id)}
        </div>
      ))}
    </div>
  );
}

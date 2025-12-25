import { useResume } from '@/contexts/ResumeContext';
import { cn } from '@/lib/utils';

export function ModernTemplate() {
  const { data, sections, editingField } = useResume();

  const visibleSections = sections.filter(s => s.visible).sort((a, b) => a.order - b.order);
  const isEditing = (field: string) => editingField === field;

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'contact':
        return (
          <header className="bg-[#1A1A1A] text-white px-10 py-8 -mx-12 -mt-12 mb-8">
            <h1 className={cn(
              "font-display text-3xl font-bold mb-1 tracking-tight transition-all duration-150",
              isEditing('contact.fullName') && "ring-2 ring-white/30 ring-offset-2 ring-offset-[#1A1A1A] rounded"
            )}>
              {data.contact.fullName || 'Your Name'}
            </h1>
            <p className={cn(
              "font-body text-base text-white/70 mb-4 transition-all duration-150",
              isEditing('contact.title') && "ring-2 ring-white/30 ring-offset-2 ring-offset-[#1A1A1A] rounded"
            )}>
              {data.contact.title || 'Professional Title'}
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/60 font-body">
              {data.contact.email && <span>{data.contact.email}</span>}
              {data.contact.phone && <span>{data.contact.phone}</span>}
              {data.contact.location && <span>{data.contact.location}</span>}
              {data.contact.linkedin && <span>{data.contact.linkedin}</span>}
              {data.contact.website && <span>{data.contact.website}</span>}
            </div>
          </header>
        );

      case 'summary':
        return data.summary ? (
          <section className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-5 bg-[#64748B] rounded-full" />
              <h2 className="font-display text-xs font-bold uppercase tracking-widest text-[#1A1A1A]">
                Summary
              </h2>
            </div>
            <p className={cn(
              "font-body text-sm text-[#1A1A1A]/75 leading-relaxed pl-4 border-l-2 border-[#F5F5F4] transition-all duration-150",
              isEditing('summary') && "ring-2 ring-[#64748B]/30 ring-offset-2 rounded"
            )}>
              {data.summary}
            </p>
          </section>
        ) : null;

      case 'experience':
        return data.experience.length > 0 ? (
          <section className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-5 bg-[#64748B] rounded-full" />
              <h2 className="font-display text-xs font-bold uppercase tracking-widest text-[#1A1A1A]">
                Experience
              </h2>
            </div>
            <div className="space-y-5 pl-4 border-l-2 border-[#F5F5F4]">
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-1.5">
                    <div>
                      <h3 className="font-body font-semibold text-[#1A1A1A]">
                        {exp.position || 'Position Title'}
                      </h3>
                      <p className="font-body text-sm text-[#64748B]">
                        {exp.company || 'Company Name'}
                      </p>
                    </div>
                    <span className="font-mono-ui text-xs text-[#64748B] bg-[#F5F5F4] px-2 py-0.5 rounded">
                      {exp.startDate} – {exp.endDate}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="font-body text-sm text-[#1A1A1A]/65 mb-2">
                      {exp.description}
                    </p>
                  )}
                  {exp.highlights.length > 0 && (
                    <ul className="space-y-1">
                      {exp.highlights.map((highlight, idx) => (
                        <li key={idx} className="font-body text-sm text-[#1A1A1A]/65 flex">
                          <span className="text-[#64748B] mr-2">→</span>
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
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-5 bg-[#64748B] rounded-full" />
              <h2 className="font-display text-xs font-bold uppercase tracking-widest text-[#1A1A1A]">
                Education
              </h2>
            </div>
            <div className="space-y-3 pl-4 border-l-2 border-[#F5F5F4]">
              {data.education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-body font-semibold text-[#1A1A1A]">
                      {edu.institution || 'Institution'}
                    </h3>
                    <p className="font-body text-sm text-[#64748B]">
                      {edu.degree}{edu.field && ` in ${edu.field}`}
                      {edu.gpa && <span className="text-[#1A1A1A]/40 ml-2">GPA: {edu.gpa}</span>}
                    </p>
                  </div>
                  <span className="font-mono-ui text-xs text-[#64748B] bg-[#F5F5F4] px-2 py-0.5 rounded">
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
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-5 bg-[#64748B] rounded-full" />
              <h2 className="font-display text-xs font-bold uppercase tracking-widest text-[#1A1A1A]">
                Skills
              </h2>
            </div>
            <div className="flex flex-wrap gap-1.5 pl-4">
              {data.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="font-body text-xs text-[#1A1A1A] border border-[#1A1A1A]/10 px-2.5 py-1 rounded-full"
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
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-5 bg-[#64748B] rounded-full" />
              <h2 className="font-display text-xs font-bold uppercase tracking-widest text-[#1A1A1A]">
                Certifications
              </h2>
            </div>
            <div className="space-y-3 pl-4 border-l-2 border-[#F5F5F4]">
              {data.certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-body font-semibold text-[#1A1A1A]">
                      {cert.name || 'Certification Name'}
                    </h3>
                    <p className="font-body text-sm text-[#64748B]">
                      {cert.issuer}
                    </p>
                    {cert.credentialId && (
                      <p className="font-mono-ui text-xs text-[#1A1A1A]/40">
                        ID: {cert.credentialId}
                      </p>
                    )}
                  </div>
                  <span className="font-mono-ui text-xs text-[#64748B] bg-[#F5F5F4] px-2 py-0.5 rounded">
                    {cert.date}{cert.expiryDate && ` – ${cert.expiryDate}`}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ) : null;

      case 'publications':
        return data.publications.length > 0 ? (
          <section className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-5 bg-[#64748B] rounded-full" />
              <h2 className="font-display text-xs font-bold uppercase tracking-widest text-[#1A1A1A]">
                Publications
              </h2>
            </div>
            <div className="space-y-4 pl-4 border-l-2 border-[#F5F5F4]">
              {data.publications.map((pub) => (
                <div key={pub.id}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-body font-semibold text-[#1A1A1A]">
                      {pub.title || 'Publication Title'}
                    </h3>
                    <span className="font-mono-ui text-xs text-[#64748B] bg-[#F5F5F4] px-2 py-0.5 rounded">
                      {pub.date}
                    </span>
                  </div>
                  <p className="font-body text-sm text-[#64748B]">{pub.publisher}</p>
                  {pub.description && (
                    <p className="font-body text-sm text-[#1A1A1A]/65 mt-1">{pub.description}</p>
                  )}
                  {pub.url && (
                    <p className="font-mono-ui text-xs text-[#64748B] mt-1">{pub.url}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ) : null;

      case 'awards':
        return data.awards.length > 0 ? (
          <section className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-5 bg-[#64748B] rounded-full" />
              <h2 className="font-display text-xs font-bold uppercase tracking-widest text-[#1A1A1A]">
                Awards
              </h2>
            </div>
            <div className="space-y-3 pl-4 border-l-2 border-[#F5F5F4]">
              {data.awards.map((award) => (
                <div key={award.id}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-body font-semibold text-[#1A1A1A]">
                      {award.title || 'Award Title'}
                    </h3>
                    <span className="font-mono-ui text-xs text-[#64748B] bg-[#F5F5F4] px-2 py-0.5 rounded">
                      {award.date}
                    </span>
                  </div>
                  <p className="font-body text-sm text-[#64748B]">{award.issuer}</p>
                  {award.description && (
                    <p className="font-body text-sm text-[#1A1A1A]/65 mt-1">{award.description}</p>
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
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-5 bg-[#64748B] rounded-full" />
                  <h2 className="font-display text-xs font-bold uppercase tracking-widest text-[#1A1A1A]">
                    {customSection.title}
                  </h2>
                </div>
                <div className="space-y-3 pl-4 border-l-2 border-[#F5F5F4]">
                  {customSection.items.map((item) => (
                    <div key={item.id}>
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="font-body font-semibold text-[#1A1A1A]">
                            {item.title || 'Item Title'}
                          </h3>
                          {item.subtitle && (
                            <p className="font-body text-sm text-[#64748B]">{item.subtitle}</p>
                          )}
                        </div>
                        {item.date && (
                          <span className="font-mono-ui text-xs text-[#64748B] bg-[#F5F5F4] px-2 py-0.5 rounded">
                            {item.date}
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="font-body text-sm text-[#1A1A1A]/65">{item.description}</p>
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

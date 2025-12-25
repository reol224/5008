import { useResume } from '@/contexts/ResumeContext';
import { cn } from '@/lib/utils';

export function TwoColumnTemplate() {
  const { data, sections, editingField } = useResume();

  const visibleSections = sections.filter(s => s.visible).sort((a, b) => a.order - b.order);
  const isEditing = (field: string) => editingField === field;

  // Split sections for two-column layout
  const leftSections = ['summary', 'experience', 'publications'];
  const rightSections = ['education', 'skills', 'certifications', 'awards'];

  const renderContactSection = () => (
    <header className="border-b border-[#1A1A1A]/10 pb-6 mb-6">
      <h1 className={cn(
        "font-display text-3xl font-bold text-[#1A1A1A] mb-1 tracking-tight transition-all duration-150",
        isEditing('contact.fullName') && "ring-2 ring-[#64748B]/30 ring-offset-2 rounded"
      )}>
        {data.contact.fullName || 'Your Name'}
      </h1>
      <p className={cn(
        "font-body text-base text-[#64748B] mb-3 transition-all duration-150",
        isEditing('contact.title') && "ring-2 ring-[#64748B]/30 ring-offset-2 rounded"
      )}>
        {data.contact.title || 'Professional Title'}
      </p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-[#1A1A1A]/60 font-mono-ui font-light">
        {data.contact.email && <span>{data.contact.email}</span>}
        {data.contact.phone && <span>{data.contact.phone}</span>}
        {data.contact.location && <span>{data.contact.location}</span>}
        {data.contact.linkedin && <span>{data.contact.linkedin}</span>}
        {data.contact.website && <span>{data.contact.website}</span>}
      </div>
    </header>
  );

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'summary':
        return data.summary ? (
          <section className="mb-6">
            <h2 className="font-display text-xs font-bold uppercase tracking-wider text-[#64748B] mb-2">
              Summary
            </h2>
            <p className={cn(
              "font-body text-xs text-[#1A1A1A]/75 leading-relaxed transition-all duration-150",
              isEditing('summary') && "ring-2 ring-[#64748B]/30 ring-offset-2 rounded"
            )}>
              {data.summary}
            </p>
          </section>
        ) : null;

      case 'experience':
        return data.experience.length > 0 ? (
          <section className="mb-6">
            <h2 className="font-display text-xs font-bold uppercase tracking-wider text-[#64748B] mb-3">
              Experience
            </h2>
            <div className="space-y-4">
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="mb-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-body font-semibold text-sm text-[#1A1A1A]">
                        {exp.position || 'Position Title'}
                      </h3>
                      <span className="font-mono-ui text-[10px] text-[#1A1A1A]/40">
                        {exp.startDate} – {exp.endDate}
                      </span>
                    </div>
                    <p className="font-body text-xs text-[#64748B]">
                      {exp.company || 'Company Name'}
                    </p>
                  </div>
                  {exp.highlights.length > 0 && (
                    <ul className="space-y-0.5 mt-1.5">
                      {exp.highlights.map((highlight, idx) => (
                        <li key={idx} className="font-body text-xs text-[#1A1A1A]/60 flex">
                          <span className="text-[#64748B] mr-1.5">•</span>
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
            <h2 className="font-display text-xs font-bold uppercase tracking-wider text-[#64748B] mb-3">
              Education
            </h2>
            <div className="space-y-3">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <h3 className="font-body font-semibold text-sm text-[#1A1A1A]">
                    {edu.institution || 'Institution'}
                  </h3>
                  <p className="font-body text-xs text-[#1A1A1A]/60">
                    {edu.degree}{edu.field && ` in ${edu.field}`}
                  </p>
                  <p className="font-mono-ui text-[10px] text-[#1A1A1A]/40">
                    {edu.startDate} – {edu.endDate}
                    {edu.gpa && ` · GPA: ${edu.gpa}`}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ) : null;

      case 'skills':
        return data.skills.length > 0 ? (
          <section>
            <h2 className="font-display text-xs font-bold uppercase tracking-wider text-[#64748B] mb-3">
              Skills
            </h2>
            <div className="flex flex-wrap gap-1">
              {data.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="font-body text-[10px] text-[#1A1A1A]/70 bg-[#F5F5F4] px-2 py-0.5 rounded"
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
            <h2 className="font-display text-xs font-bold uppercase tracking-wider text-[#64748B] mb-3">
              Certifications
            </h2>
            <div className="space-y-2">
              {data.certifications.map((cert) => (
                <div key={cert.id}>
                  <h3 className="font-body font-semibold text-sm text-[#1A1A1A]">
                    {cert.name || 'Certification Name'}
                  </h3>
                  <p className="font-body text-xs text-[#1A1A1A]/60">{cert.issuer}</p>
                  <p className="font-mono-ui text-[10px] text-[#1A1A1A]/40">
                    {cert.date}
                    {cert.expiryDate && ` – ${cert.expiryDate}`}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ) : null;

      case 'publications':
        return data.publications.length > 0 ? (
          <section className="mb-6">
            <h2 className="font-display text-xs font-bold uppercase tracking-wider text-[#64748B] mb-3">
              Publications
            </h2>
            <div className="space-y-3">
              {data.publications.map((pub) => (
                <div key={pub.id}>
                  <h3 className="font-body font-semibold text-sm text-[#1A1A1A]">
                    {pub.title || 'Publication Title'}
                  </h3>
                  <p className="font-body text-xs text-[#1A1A1A]/60">{pub.publisher}</p>
                  <p className="font-mono-ui text-[10px] text-[#1A1A1A]/40">{pub.date}</p>
                  {pub.description && (
                    <p className="font-body text-xs text-[#1A1A1A]/50 mt-1">{pub.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ) : null;

      case 'awards':
        return data.awards.length > 0 ? (
          <section className="mb-6">
            <h2 className="font-display text-xs font-bold uppercase tracking-wider text-[#64748B] mb-3">
              Awards
            </h2>
            <div className="space-y-2">
              {data.awards.map((award) => (
                <div key={award.id}>
                  <h3 className="font-body font-semibold text-sm text-[#1A1A1A]">
                    {award.title || 'Award Title'}
                  </h3>
                  <p className="font-body text-xs text-[#1A1A1A]/60">{award.issuer}</p>
                  <p className="font-mono-ui text-[10px] text-[#1A1A1A]/40">{award.date}</p>
                  {award.description && (
                    <p className="font-body text-xs text-[#1A1A1A]/50 mt-1">{award.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ) : null;

      default:
        // Handle custom sections (put in left column by default)
        if (sectionId.startsWith('custom-')) {
          const customSection = data.customSections.find(s => s.id === sectionId);
          if (customSection && customSection.items.length > 0) {
            return (
              <section className="mb-6">
                <h2 className="font-display text-xs font-bold uppercase tracking-wider text-[#64748B] mb-3">
                  {customSection.title}
                </h2>
                <div className="space-y-2">
                  {customSection.items.map((item) => (
                    <div key={item.id}>
                      <h3 className="font-body font-semibold text-sm text-[#1A1A1A]">
                        {item.title || 'Item Title'}
                      </h3>
                      {item.subtitle && (
                        <p className="font-body text-xs text-[#1A1A1A]/60">{item.subtitle}</p>
                      )}
                      {item.date && (
                        <p className="font-mono-ui text-[10px] text-[#1A1A1A]/40">{item.date}</p>
                      )}
                      {item.description && (
                        <p className="font-body text-xs text-[#1A1A1A]/50 mt-1">{item.description}</p>
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

  const contactVisible = visibleSections.find(s => s.id === 'contact');

  return (
    <div className="p-10 min-h-full">
      {contactVisible && renderContactSection()}
      
      <div className="grid grid-cols-[1.5fr_1fr] gap-8">
        {/* Left Column - Main Content */}
        <div>
          {visibleSections
            .filter(s => leftSections.includes(s.id) || s.id.startsWith('custom-'))
            .map((section) => (
              <div key={section.id}>
                {renderSection(section.id)}
              </div>
            ))}
        </div>

        {/* Right Column - Supporting Info */}
        <div className="border-l border-[#1A1A1A]/5 pl-6">
          {visibleSections
            .filter(s => rightSections.includes(s.id))
            .map((section) => (
              <div key={section.id}>
                {renderSection(section.id)}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

import { useResume } from '@/contexts/ResumeContext';
import { FloatingInput } from '../FloatingInput';

export function ContactSection() {
  const { data, updateContact, setEditingField } = useResume();

  return (
    <div className="space-y-3">
      <FloatingInput
        label="Full Name"
        value={data.contact.fullName}
        onChange={(value) => updateContact({ fullName: value })}
        onFocus={() => setEditingField('contact.fullName')}
        onBlur={() => setEditingField(null)}
      />
      <FloatingInput
        label="Professional Title"
        value={data.contact.title}
        onChange={(value) => updateContact({ title: value })}
        onFocus={() => setEditingField('contact.title')}
        onBlur={() => setEditingField(null)}
      />
      <div className="grid grid-cols-2 gap-3">
        <FloatingInput
          label="Email"
          value={data.contact.email}
          onChange={(value) => updateContact({ email: value })}
          onFocus={() => setEditingField('contact.email')}
          onBlur={() => setEditingField(null)}
        />
        <FloatingInput
          label="Phone"
          value={data.contact.phone}
          onChange={(value) => updateContact({ phone: value })}
          onFocus={() => setEditingField('contact.phone')}
          onBlur={() => setEditingField(null)}
        />
      </div>
      <FloatingInput
        label="Location"
        value={data.contact.location}
        onChange={(value) => updateContact({ location: value })}
        onFocus={() => setEditingField('contact.location')}
        onBlur={() => setEditingField(null)}
      />
      <div className="grid grid-cols-2 gap-3">
        <FloatingInput
          label="LinkedIn"
          value={data.contact.linkedin || ''}
          onChange={(value) => updateContact({ linkedin: value })}
          onFocus={() => setEditingField('contact.linkedin')}
          onBlur={() => setEditingField(null)}
        />
        <FloatingInput
          label="Website"
          value={data.contact.website || ''}
          onChange={(value) => updateContact({ website: value })}
          onFocus={() => setEditingField('contact.website')}
          onBlur={() => setEditingField(null)}
        />
      </div>
    </div>
  );
}

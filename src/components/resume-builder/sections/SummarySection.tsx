import { useResume } from '@/contexts/ResumeContext';
import { FloatingInput } from '../FloatingInput';

export function SummarySection() {
  const { data, updateSummary, setEditingField } = useResume();

  return (
    <FloatingInput
      label="Professional Summary"
      value={data.summary}
      onChange={updateSummary}
      onFocus={() => setEditingField('summary')}
      onBlur={() => setEditingField(null)}
      multiline
    />
  );
}

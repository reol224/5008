import { useResume } from '@/contexts/ResumeContext';
import { FloatingInput } from '../FloatingInput';
import { cn } from '@/lib/utils';

const MAX_SUMMARY_LENGTH = 500;
const WARNING_SUMMARY_LENGTH = 400;

export function SummarySection() {
  const { data, updateSummary, setEditingField } = useResume();
  
  const charCount = data.summary?.length || 0;
  const lengthStatus = charCount > MAX_SUMMARY_LENGTH ? 'error' : 
                       charCount > WARNING_SUMMARY_LENGTH ? 'warning' : 'ok';

  return (
    <div className="space-y-1">
      <FloatingInput
        label="Professional Summary"
        value={data.summary}
        onChange={updateSummary}
        onFocus={() => setEditingField('summary')}
        onBlur={() => setEditingField(null)}
        multiline
      />
      {/* Character counter for summary */}
      <div className="flex justify-end">
        <span className={cn(
          "text-[9px] font-mono tabular-nums transition-colors",
          lengthStatus === 'error' ? "text-red-500" :
          lengthStatus === 'warning' ? "text-amber-500" :
          "text-muted-foreground/40"
        )}>
          {charCount}/{MAX_SUMMARY_LENGTH}
        </span>
      </div>
      {lengthStatus !== 'ok' && (
        <p className={cn(
          "text-[10px]",
          lengthStatus === 'error' ? "text-red-500" : "text-amber-500"
        )}>
          {lengthStatus === 'error' 
            ? "Summary is too long. Consider shortening for better readability."
            : "Summary is getting long. Consider being more concise."}
        </p>
      )}
    </div>
  );
}

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface FloatingInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  multiline?: boolean;
  className?: string;
}

export function FloatingInput({
  label,
  value,
  onChange,
  onFocus,
  onBlur,
  multiline = false,
  className,
}: FloatingInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const hasValue = value.length > 0;
  const showLabel = !isFocused && !hasValue;

  const inputClasses = cn(
    "w-full bg-transparent text-[13px] font-body text-foreground",
    "placeholder:text-muted-foreground/50",
    "focus:outline-none focus:ring-0",
    "border-b border-transparent hover:border-black/10 focus:border-[#64748B]",
    "py-2 transition-all duration-150",
    className
  );

  if (multiline) {
    return (
      <div className="relative">
        {showLabel && (
          <span className="absolute left-0 top-2 font-mono-ui text-xs font-light text-muted-foreground/70 pointer-events-none">
            {label}
          </span>
        )}
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          rows={3}
          className={cn(inputClasses, "resize-none")}
        />
      </div>
    );
  }

  return (
    <div className="relative">
      {showLabel && (
        <span className="absolute left-0 top-2 font-mono-ui text-xs font-light text-muted-foreground/70 pointer-events-none">
          {label}
        </span>
      )}
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={inputClasses}
      />
    </div>
  );
}

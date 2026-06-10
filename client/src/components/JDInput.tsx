import { Textarea } from '@/components/ui/textarea';
import { JD_MIN, JD_MAX } from '@/schemas/analyze';
import { cn } from '@/lib/utils';

const SAMPLE = `Senior Frontend Engineer
We're looking for a Senior Frontend Engineer with 4+ years of experience to join our Web Platform team.

Responsibilities
- Build performant, accessible UI in React + TypeScript
- Own end-to-end features across design, frontend, and API integration
- Collaborate with designers using Figma and shadcn/ui patterns

Requirements
- Strong React, TypeScript, and Next.js experience
- Familiarity with TanStack Query, Zustand, and modern state patterns
- Comfortable writing unit + integration tests (Jest, Testing Library)
- Solid understanding of REST, auth flows, and performance optimization`;

interface JDInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function JDInput({ value, onChange }: JDInputProps) {
  const len = value.length;
  const tooShort = len > 0 && len < JD_MIN;
  const inRange = len >= JD_MIN && len <= JD_MAX;
  const over = len > JD_MAX;

  return (
    <div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, JD_MAX))}
        placeholder={`Paste the full job description here (${JD_MIN}–${JD_MAX} characters)...`}
        className="min-h-[200px] font-mono text-[13px]"
      />
      <div className="mt-1.5 flex items-center justify-between text-xs">
        <span
          className={cn(
            'font-mono',
            over && 'text-destructive',
            inRange && 'text-success',
            tooShort && 'text-warning',
            len === 0 && 'text-muted-foreground'
          )}
        >
          {len} / {JD_MAX}
          {tooShort && ` · need ${JD_MIN - len} more`}
        </span>
        <button
          type="button"
          onClick={() => onChange(SAMPLE.slice(0, JD_MAX))}
          className="font-medium text-primary hover:underline"
        >
          Try sample →
        </button>
      </div>
    </div>
  );
}

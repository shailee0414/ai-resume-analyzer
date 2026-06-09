import { Textarea } from '@/components/ui/textarea';

const MAX = 5000;

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
- Solid understanding of REST, auth flows, and performance optimization

Nice to have
- Experience with Tailwind CSS, Radix UI, and design systems
- Exposure to Node/Express, Mongo, or similar full-stack work
- Contributions to open source`;

interface JDInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function JDInput({ value, onChange }: JDInputProps) {
  return (
    <div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, MAX))}
        placeholder="Paste the full job description here..."
        className="min-h-[200px] font-mono text-[13px]"
      />
      <div className="mt-1.5 flex items-center justify-between text-xs">
        <span className="font-mono text-muted-foreground">
          {value.length} / {MAX}
        </span>
        <button
          type="button"
          onClick={() => onChange(SAMPLE)}
          className="font-medium text-primary hover:underline"
        >
          Try sample →
        </button>
      </div>
    </div>
  );
}

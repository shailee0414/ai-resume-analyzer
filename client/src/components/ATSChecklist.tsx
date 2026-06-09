import { Check, X } from 'lucide-react';
import type { ATSCheck } from '@/types';
import { cn } from '@/lib/utils';

export function ATSChecklist({ checks }: { checks: ATSCheck[] }) {
  if (!checks.length) return <p className="text-sm text-muted-foreground">No checks returned.</p>;
  return (
    <ul className="divide-y divide-border">
      {checks.map((c, i) => (
        <li key={i} className="flex items-start gap-3 py-2.5">
          <span
            className={cn(
              'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded',
              c.pass ? 'bg-success/15 text-success' : 'bg-destructive/15 text-destructive'
            )}
          >
            {c.pass ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
          </span>
          <div className="min-w-0">
            <div className="text-sm font-medium">{c.label}</div>
            {c.note && <div className="mt-0.5 text-xs text-muted-foreground">{c.note}</div>}
          </div>
        </li>
      ))}
    </ul>
  );
}

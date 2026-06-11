import { Card, CardContent } from '@/components/ui/card';
import type { Suggestion } from '@/types';

export function SuggestionCard({ s }: { s: Suggestion }) {
  return (
    <Card className="h-full" >
      <CardContent  className="flex flex-col space-y-3 p-5">
        <div className="font-mono text-[10px] uppercase tracking-wider text-primary">{s.area}</div>
        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3">
          <div className="mb-1 font-mono text-[10px] uppercase text-destructive">Before</div>
          <p className="text-sm leading-relaxed text-muted-foreground line-through">{s.before}</p>
        </div>
        <div className="rounded-md border border-success/30 bg-success/5 p-3">
          <div className="mb-1 font-mono text-[10px] uppercase text-success">After</div>
          <p className="text-sm leading-relaxed text-foreground">{s.after}</p>
        </div>
        <p className="text-xs italic text-muted-foreground">{s.why}</p>
      </CardContent>
    </Card>
  );
}

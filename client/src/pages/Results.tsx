import { useLocation, useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { useHistoryItem } from '@/hooks/useHistory';
import { ScoreGauge } from '@/components/ScoreGauge';
import { KeywordChip } from '@/components/KeywordChip';
import { SuggestionCard } from '@/components/SuggestionCard';
import { ATSChecklist } from '@/components/ATSChecklist';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import type { AnalysisResult } from '@/types';

const spring = {
  type: 'spring' as const,
  stiffness: 220,
  damping: 22,
  mass: 0.9,
};

const pop = (delay = 0) => ({
  initial: { opacity: 0, y: 16, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { ...spring, delay },
});

const chipIn = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.7 },
  animate: { opacity: 1, scale: 1 },
  transition: { ...spring, delay },
});

export default function Results() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const initial = (location.state as { result?: AnalysisResult } | null)?.result;

  const { data: fetched, isLoading } = useHistoryItem(initial ? undefined : id);
  const result = initial || fetched;

  if (!result) {
    return (
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-10">
        <Skeleton className="h-40 w-full" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
        {isLoading && <p className="text-center text-xs text-muted-foreground">Loading analysis…</p>}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-10">
      <Button asChild variant="ghost" size="sm" className="gap-1.5">
        <Link to="/analyze">
          <ArrowLeft className="h-4 w-4" /> New analysis
        </Link>
      </Button>

      <motion.div {...pop(0)}>
        <Card>
          <CardContent className="flex flex-col items-center gap-6 p-6 md:flex-row md:gap-8">
            <ScoreGauge score={result.score} />
            <div className="flex-1 text-center md:text-left">
              <div className="font-mono text-[10px] uppercase tracking-wider text-primary">Result</div>
              <h2 className="mt-2 text-xl font-semibold md:text-2xl">{result.jobTitle || 'Match analysis'}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{result.matchSummary}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2">
        <motion.div {...pop(0.15)}>
          <Card>
            <CardContent className="p-5">
              <div className="mb-3 font-mono text-[10px] uppercase tracking-wider text-success">
                ✓ Strong · {result.strongKeywords.length}
              </div>
              <div className="-mt-1.5 flex flex-wrap">
                {result.strongKeywords.map((k, i) => (
                  <motion.span key={k} {...chipIn(0.25 + i * 0.03)}>
                    <KeywordChip label={k} kind="strong" />
                  </motion.span>
                ))}
                {!result.strongKeywords.length && (
                  <p className="text-sm text-muted-foreground">None detected.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...pop(0.25)}>
          <Card>
            <CardContent className="p-5">
              <div className="mb-3 font-mono text-[10px] uppercase tracking-wider text-destructive">
                ✗ Missing · {result.missingKeywords.length}
              </div>
              <div className="-mt-1.5 flex flex-wrap">
                {result.missingKeywords.map((k, i) => (
                  <motion.span key={k} {...chipIn(0.35 + i * 0.03)}>
                    <KeywordChip label={k} kind="missing" />
                  </motion.span>
                ))}
                {!result.missingKeywords.length && (
                  <p className="text-sm text-muted-foreground">Nothing missing — nice.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div {...pop(0.4)}>
        <Card>
          <CardContent className="p-5">
            <h3 className="mb-3 text-sm font-semibold">ATS readiness</h3>
            <ATSChecklist checks={result.atsChecks} />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div {...pop(0.55)} className="space-y-4">
        <h3 className="text-sm font-semibold">Rewrite suggestions</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {result.suggestions.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ ...spring, delay: 0.65 + i * 0.08 }}
              whileHover={{ y: -3, transition: { duration: 0.15 } }}
            >
              <SuggestionCard s={s} />
            </motion.div>
          ))}
          {!result.suggestions.length && (
            <p className="text-sm text-muted-foreground">No suggestions returned.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

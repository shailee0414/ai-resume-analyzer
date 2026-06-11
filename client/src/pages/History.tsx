import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Inbox } from 'lucide-react';
import { useHistory } from '@/hooks/useHistory';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const spring = { type: 'spring' as const, stiffness: 220, damping: 22, mass: 0.9 };

export default function History() {
  const { data, isLoading } = useHistory();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring}
      >
        <h1 className="font-serif text-3xl italic md:text-4xl">Your analyses</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last 20 analyses, most recent first.
        </p>
      </motion.div>

      <div className="mt-10 space-y-5">
        {isLoading && (
          <>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </>
        )}

        {!isLoading && (!data || data.length === 0) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...spring, delay: 0.1 }}
          >
            <Card>
              <CardContent className="flex flex-col items-center gap-3 p-12 text-center">
                <Inbox className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">No analyses yet</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    <Link to="/analyze" className="text-primary hover:underline">
                      Run your first analysis →
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {data?.map((item, i) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ ...spring, delay: 0.08 + i * 0.06 }}
            whileHover={{ y: -3, transition: { duration: 0.18 } }}
          >
            <Link to={`/results/${item._id}`}>
              <Card className="transition-colors hover:border-primary/40">
                <CardContent className="flex items-center justify-between gap-5 p-6">
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-base font-semibold">
                      {item.jobTitle || 'Untitled analysis'}
                    </div>
                    <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                      {item.matchSummary}
                    </p>
                    <div className="mt-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      {new Date(item.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="font-mono text-3xl font-semibold tabular-nums text-primary">
                      {item.score}
                    </div>
                    <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                      match
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

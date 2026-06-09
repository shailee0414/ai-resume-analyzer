import { Link } from 'react-router-dom';
import { Inbox } from 'lucide-react';
import { useHistory } from '@/hooks/useHistory';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function History() {
  const { data, isLoading } = useHistory();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-serif text-3xl italic md:text-4xl">Your analyses</h1>
      <p className="mt-1 text-sm text-muted-foreground">Last 20 analyses, most recent first.</p>

      <div className="mt-8 space-y-3">
        {isLoading && (
          <>
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </>
        )}

        {!isLoading && (!data || data.length === 0) && (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
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
        )}

        {data?.map((item) => (
          <Link key={item._id} to={`/results/${item._id}`}>
            <Card className="transition-colors hover:border-primary/40">
              <CardContent className="flex items-center justify-between gap-4 p-5">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{item.jobTitle || 'Untitled analysis'}</div>
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{item.matchSummary}</p>
                  <div className="mt-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {new Date(item.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="font-mono text-2xl font-semibold tabular-nums text-primary">
                    {item.score}
                  </div>
                  <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                    match
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Target, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScoreGauge } from '@/components/ScoreGauge';

export default function Landing() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
      <section className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
          Powered by Claude AI
        </div>
        <h1 className="mt-6 font-serif text-5xl italic leading-tight md:text-7xl">
          Beat the ATS.
          <br />
          Land the interview.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground md:text-lg">
          Upload your resume, paste a JD, get surgical AI feedback in under 10 seconds — match score, missing
          keywords, ATS readiness, and rewrite suggestions.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/signup">
              Try free <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/login">See demo</Link>
          </Button>
        </div>
      </section>

      <section className="mt-20 flex justify-center">
        <Card className="w-full max-w-2xl">
          <CardContent className="flex flex-col items-center gap-6 p-8 md:flex-row md:gap-10">
            <ScoreGauge score={78} />
            <div className="text-center md:text-left">
              <div className="font-mono text-[10px] uppercase tracking-wider text-primary">Sample result</div>
              <h3 className="mt-2 text-lg font-semibold">Sr. Frontend Engineer · Razorpay</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Strong match. Adding TypeScript and Next.js would push you over the line.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mt-24 grid gap-4 md:grid-cols-3">
        <Feature
          icon={<Target className="h-5 w-5" />}
          title="Match score"
          body="Honest 0–100 verdict on how your resume stacks up against the JD."
        />
        <Feature
          icon={<Sparkles className="h-5 w-5" />}
          title="Keyword gap"
          body="See exactly which JD keywords are missing — and which you already nailed."
        />
        <Feature
          icon={<FileCheck className="h-5 w-5" />}
          title="ATS checklist"
          body="Hits the most common ATS pitfalls so your resume actually reaches a human."
        />
      </section>
    </div>
  );
}

function Feature({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
          {icon}
        </div>
        <h4 className="text-base font-semibold">{title}</h4>
        <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
      </CardContent>
    </Card>
  );
}

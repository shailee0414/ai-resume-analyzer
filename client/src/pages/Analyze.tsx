import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowRight } from 'lucide-react';
import { UploadZone } from '@/components/UploadZone';
import { JDInput } from '@/components/JDInput';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAnalyze } from '@/hooks/useAnalyze';
import { apiErrorMessage } from '@/lib/api';
import { analyzeSchema, JD_MIN, JD_MAX } from '@/schemas/analyze';

export default function Analyze() {
  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState('');
  const navigate = useNavigate();
  const { mutate, isPending } = useAnalyze();

  function submit() {
    if (!file) return toast.error('Please upload a resume PDF');
    const parsed = analyzeSchema.safeParse({ jd });
    if (!parsed.success) {
      return toast.error(parsed.error.issues[0].message);
    }
    mutate(
      { resume: file, jd },
      {
        onSuccess: (data) => {
          if (data.id) navigate(`/results/${data.id}`, { state: { result: data } });
        },
        onError: (err) => toast.error(apiErrorMessage(err, 'Analysis failed')),
      }
    );
  }

  const jdLen = jd.length;
  const canSubmit = !!file && jdLen >= JD_MIN && jdLen <= JD_MAX && !isPending;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8">
        <h1 className="font-serif text-3xl italic md:text-4xl">Analyze your resume</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Drop your PDF, paste the job description, hit analyze. 10 seconds, done.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Resume</Label>
          <UploadZone file={file} onFile={setFile} />
        </div>
        <div className="space-y-2">
          <Label>Job description</Label>
          <JDInput value={jd} onChange={setJd} />
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Button size="lg" disabled={!canSubmit} onClick={submit}>
          {isPending ? 'Analyzing…' : (<>Analyze resume <ArrowRight className="h-4 w-4" /></>)}
        </Button>
      </div>
    </div>
  );
}

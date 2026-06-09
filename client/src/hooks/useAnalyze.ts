import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { AnalysisResult } from '@/types';
import { queryClient } from '@/lib/queryClient';

interface AnalyzeArgs {
  resume: File;
  jd: string;
}

export function useAnalyze() {
  return useMutation<AnalysisResult, Error, AnalyzeArgs>({
    mutationFn: async ({ resume, jd }) => {
      const form = new FormData();
      form.append('resume', resume);
      form.append('jd', jd);
      const { data } = await api.post<AnalysisResult>('/api/analyze', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
  });
}

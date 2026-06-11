import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { AnalysisResult, HistoryItem } from '@/types';

export function useHistory() {
  return useQuery<HistoryItem[]>({
    queryKey: ['history'],
    queryFn: async () => {
      const { data } = await api.get<{ items: HistoryItem[] }>('/api/history');
      return data.items;
    },
  });
}

function toAnalysisResult(item: HistoryItem): AnalysisResult {
  return {
    id: item._id,
    score: item.score,
    matchSummary: item.matchSummary,
    jobTitle: item.jobTitle,
    strongKeywords: item.strongKeywords,
    missingKeywords: item.missingKeywords,
    atsChecks: item.atsChecks,
    suggestions: item.suggestions,
    createdAt: item.createdAt,
  };
}

export function useHistoryItem(id: string | undefined) {
  const queryClient = useQueryClient();

  return useQuery<AnalysisResult>({
    queryKey: ['history', id],
    enabled: !!id,
    initialData: () => {
      const list = queryClient.getQueryData<HistoryItem[]>(['history']);
      const cached = list?.find((item) => item._id === id);
      return cached ? toAnalysisResult(cached) : undefined;
    },
    initialDataUpdatedAt: () => queryClient.getQueryState(['history'])?.dataUpdatedAt,
    queryFn: async () => {
      const { data } = await api.get<AnalysisResult>(`/api/history/${id}`);
      return data;
    },
  });
}

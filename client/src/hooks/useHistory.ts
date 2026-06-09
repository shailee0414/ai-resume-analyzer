import { useQuery } from '@tanstack/react-query';
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

export function useHistoryItem(id: string | undefined) {
  return useQuery<AnalysisResult>({
    queryKey: ['history', id],
    enabled: !!id,
    queryFn: async () => {
      const { data } = await api.get<AnalysisResult>(`/api/history/${id}`);
      return data;
    },
  });
}

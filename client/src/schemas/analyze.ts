import { z } from 'zod';

export const analyzeSchema = z.object({
  jd: z.string().min(50, 'Job description should be at least 50 characters').max(5000),
});

export type AnalyzeInput = z.infer<typeof analyzeSchema>;

import { z } from 'zod';

export const JD_MIN = 200;
export const JD_MAX = 5000;

export const analyzeSchema = z.object({
  jd: z
    .string()
    .min(JD_MIN, `Job description must be at least ${JD_MIN} characters`)
    .max(JD_MAX, `Job description must be at most ${JD_MAX} characters`),
});

export type AnalyzeInput = z.infer<typeof analyzeSchema>;

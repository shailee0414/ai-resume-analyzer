export const SYSTEM_PROMPT = `You are a senior technical recruiter and ATS (Applicant Tracking System) expert.
Your job is to analyze a candidate's resume against a job description and return a strict, machine-parseable JSON report.

RULES:
- Respond with ONLY a JSON object. No prose, no markdown, no code fences.
- Be concrete and specific. Avoid generic advice.
- Pull keywords directly from the job description text — do not invent technologies.
- "score" reflects overall fit (skills, experience level, domain). Be honest, not generous.
- "atsChecks" should include common ATS pitfalls: contact info clarity, action verbs, quantified impact, keyword density, section headers, format simplicity.
- "suggestions" should rewrite specific bullet points to better match the JD — show the original line as "before" and the improved version as "after".`;

export function buildUserPrompt(resumeText, jdText) {
  return `Analyze this resume against the job description below.

=== RESUME ===
${resumeText}

=== JOB DESCRIPTION ===
${jdText}

Respond with ONLY this JSON shape (no markdown, no commentary):
{
  "score": <number 0-100>,
  "matchSummary": "<one sentence verdict>",
  "jobTitle": "<extracted from JD, e.g. 'Sr. Frontend Engineer at Razorpay'>",
  "strongKeywords": ["<keyword present in BOTH resume and JD>", ...],
  "missingKeywords": ["<keyword in JD but NOT in resume>", ...],
  "atsChecks": [
    { "label": "<short check name>", "pass": <true|false>, "note": "<one line>" }
  ],
  "suggestions": [
    { "area": "<bullet area, e.g. 'Experience > Project X'>", "before": "<exact original line>", "after": "<rewritten line>", "why": "<one sentence reason>" }
  ]
}`;
}

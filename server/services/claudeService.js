import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT, buildUserPrompt } from '../prompts/analyzerPrompt.js';
import { extractJson } from '../utils/jsonExtract.js';
import { httpError } from '../middleware/errorHandler.js';

const PROVIDER = (process.env.AI_PROVIDER || 'openrouter').toLowerCase();
const MAX_TOKENS = 2000;

const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5';
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'anthropic/claude-sonnet-4.5';
const OPENROUTER_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';

let anthropicClient;
function getAnthropic() {
  if (!anthropicClient) {
    if (!process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY is not set');
    anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return anthropicClient;
}

async function callAnthropic(userPrompt) {
  const response = await getAnthropic().messages.create({
    model: ANTHROPIC_MODEL,
    max_tokens: MAX_TOKENS,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userPrompt }],
  });
  return response.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('\n');
}

async function callOpenRouter(userPrompt) {
  if (!process.env.OPENROUTER_API_KEY) throw new Error('OPENROUTER_API_KEY is not set');

  const res = await fetch(OPENROUTER_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.CLIENT_ORIGIN || 'http://localhost:5173',
      'X-Title': 'ResumeFit',
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      max_tokens: MAX_TOKENS,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenRouter ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error('Empty completion');
  return text;
}

async function callOnce(userPrompt) {
  switch (PROVIDER) {
    case 'anthropic':
      return callAnthropic(userPrompt);
    case 'openrouter':
      return callOpenRouter(userPrompt);
    default:
      throw new Error(`Unknown AI_PROVIDER "${PROVIDER}" — use "anthropic" or "openrouter"`);
  }
}

function validate(result) {
  if (typeof result.score !== 'number' || result.score < 0 || result.score > 100) {
    throw new Error('Invalid score');
  }
  if (!Array.isArray(result.strongKeywords)) result.strongKeywords = [];
  if (!Array.isArray(result.missingKeywords)) result.missingKeywords = [];
  if (!Array.isArray(result.atsChecks)) result.atsChecks = [];
  if (!Array.isArray(result.suggestions)) result.suggestions = [];
  result.matchSummary = result.matchSummary || '';
  result.jobTitle = result.jobTitle || '';
  return result;
}

export async function callClaude(resumeText, jdText) {
  const userPrompt = buildUserPrompt(resumeText, jdText);

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const text = await callOnce(userPrompt);
      return validate(extractJson(text));
    } catch (err) {
      if (attempt === 1) {
        console.error(`[${PROVIDER}] failed after retry:`, err.message);
        throw httpError(502, 'AI analysis failed. Please try again.');
      }
    }
  }
}

export function extractJson(text) {
  if (!text) throw new Error('Empty model response');
  let cleaned = text.trim();

  const fenced = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) cleaned = fenced[1].trim();

  const firstBrace = cleaned.indexOf('{');
  if (firstBrace === -1) throw new Error('No JSON object found');
  cleaned = cleaned.slice(firstBrace);

  try {
    const lastBrace = cleaned.lastIndexOf('}');
    if (lastBrace > 0) {
      return JSON.parse(cleaned.slice(0, lastBrace + 1));
    }
  } catch {
    // fall through to recovery
  }

  return recoverTruncated(cleaned);
}

function recoverTruncated(text) {
  const stack = [];
  let lastBalanced = -1;
  let inString = false;
  let escape = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (c === '\\') {
      escape = true;
      continue;
    }
    if (c === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;
    if (c === '{' || c === '[') stack.push(c);
    else if (c === '}' || c === ']') {
      stack.pop();
      if (stack.length === 0) lastBalanced = i;
    }
  }

  if (lastBalanced > 0) {
    return JSON.parse(text.slice(0, lastBalanced + 1));
  }

  let recovered = text;
  if (inString) {
    const lastQuote = recovered.lastIndexOf('"');
    if (lastQuote > 0) recovered = recovered.slice(0, lastQuote);
  }
  const lastComma = recovered.lastIndexOf(',');
  const lastOpen = Math.max(recovered.lastIndexOf('{'), recovered.lastIndexOf('['));
  if (lastComma > lastOpen) recovered = recovered.slice(0, lastComma);

  const openers = [];
  let s = false;
  let e = false;
  for (let i = 0; i < recovered.length; i++) {
    const c = recovered[i];
    if (e) { e = false; continue; }
    if (c === '\\') { e = true; continue; }
    if (c === '"') { s = !s; continue; }
    if (s) continue;
    if (c === '{' || c === '[') openers.push(c);
    else if (c === '}' || c === ']') openers.pop();
  }
  while (openers.length) {
    const open = openers.pop();
    recovered += open === '{' ? '}' : ']';
  }

  return JSON.parse(recovered);
}

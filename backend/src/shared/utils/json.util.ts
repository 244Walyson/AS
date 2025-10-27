export function sanitizeLLMJson(raw: string): string {
  // Remove ```json e ```
  let sanitized = raw.replace(/```json/g, "").replace(/```/g, "").trim();

  // Remove possíveis aspas duplas extras ao redor
  if (sanitized.startsWith('"') && sanitized.endsWith('"')) {
    sanitized = sanitized.slice(1, -1).trim();
  }

  return sanitized;
}
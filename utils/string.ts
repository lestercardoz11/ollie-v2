export function capitalizeTitleCase(str: string): string {
  if (!str || str.length === 0) return str;
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function convertToBulletPoints(
  text: string,
  format: 'markdown' | 'array' | 'html' = 'markdown'
): string | string[] {
  if (!text || text.trim().length === 0) {
    return format === 'array' ? [] : '';
  }

  // Split text into sentences
  // Handles periods, but avoids splitting on common abbreviations
  const sentences = text
    .split(/\.(?=\s+[A-Z])|\.(?=\s*$)/) // Split on period followed by space and capital letter, or end of string
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((s) => {
      // Remove trailing period if exists
      let cleaned = s.trim();
      if (cleaned.endsWith('.')) {
        cleaned = cleaned.slice(0, -1);
      }
      return cleaned;
    })
    .filter((s) => s.length > 0);

  // Return based on format
  if (format === 'array') {
    return sentences;
  }

  if (format === 'html') {
    return `<ul>\n${sentences.map((s) => `  <li>${s}</li>`).join('\n')}\n</ul>`;
  }

  // Default: markdown format
  return sentences.map((s) => `- ${s}`).join('\n');
}

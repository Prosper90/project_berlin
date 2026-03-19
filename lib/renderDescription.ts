/**
 * Renders a plain-text event description into safe HTML:
 * - Preserves paragraphs (blank lines) and line breaks
 * - Converts [link text](https://url) markdown syntax to <a> tags
 * - Auto-detects plain https:// URLs and makes them clickable
 * - Links render in accent color
 */
export function renderDescription(text: string): string {
  if (!text) return '';

  // 1. Escape HTML special chars to prevent XSS
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  // 2. Convert [link text](https://url) → <a>
  const withMdLinks = escaped.replace(
    /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="desc-link">$1</a>',
  );

  // 3. Auto-link bare https:// URLs (not already inside an href)
  const withAutoLinks = withMdLinks.replace(
    /(?<!href=")(https?:\/\/[^\s<"]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="desc-link">$1</a>',
  );

  // 4. Split on blank lines → paragraphs; single newlines → <br>
  const paragraphs = withAutoLinks
    .split(/\n{2,}/)
    .map((para) => `<p>${para.replace(/\n/g, '<br>')}</p>`)
    .join('');

  return paragraphs;
}

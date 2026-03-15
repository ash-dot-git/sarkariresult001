import StyledText from './StyledText';

/**
 * ColorMarkdownRenderer
 * 
 * Re-written to act as a lightweight wrapper around the new StyledText component.
 * We keep the filename the same to avoid breaking 20+ consumer imports across the project.
 * 
 * It no longer uses ReactMarkdown or the 14 heavy regex string replacements.
 * 
 * @param {string} content - The text with {red}...{/red} tags
 * @param {string} pClassName - Classes applied to the wrapper span
 * @param {string} aClassName - Classes applied to links (handled internally by StyledText now)
 */
const ColorMarkdownRenderer = ({ content, pClassName = "leading-relaxed", aClassName }) => {
  if (!content || typeof content !== 'string') return null;

  // Render raw markdown links if aClassName is provided for legacy compatibility
  // StyledText handles it naturally, but pClassName provides the base styles.
  const combinedClassName = `${pClassName}`;

  return (
    <StyledText text={content} className={combinedClassName} />
  );
};

export default ColorMarkdownRenderer;

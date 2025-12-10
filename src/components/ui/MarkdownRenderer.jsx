// components/ui/MarkdownRenderer.jsx
import React, { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

const MarkdownRenderer = ({
  content,
  descriptiveText,
  pClassName = '',
  strongClassName = '',
  liClassName = '',
  aClassName = '',
  asInline = false
}) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    rehypePlugins={[rehypeRaw]}
    components={{
      p: ({ node, ...props }) =>
        asInline ? (
          <span {...props} className={pClassName} />
        ) : (
          <p {...props} className={pClassName} />
        ),
      strong: ({ node, ...props }) => (
        <strong {...props} className={strongClassName} />
      ),
      li: ({ node, ...props }) => (
        <li {...props} className={liClassName} />
      ),
      a: ({ node, ...props }) => (
        <a {...props} className={aClassName} target="_blank" rel="noopener noreferrer" aria-label={descriptiveText}/>
      ),
    }}
  >
    {content}
  </ReactMarkdown>
);

export default memo(MarkdownRenderer);
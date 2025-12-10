// components/ui/ColorMarkdownRenderer.jsx
import MarkdownRenderer from './MarkdownRenderer';
import { memo } from 'react';

const ColorMarkdownRenderer = ({ content, pClassName = "leading-relaxed", descriptiveText='', aClassName }) => {
  if (!content || typeof content !== 'string') return null;
  const transformed = content
    // Text colors
    .replace(/\{red\}(.+?)\{\/red\}/g, '<span style="color:#dc2626;">$1</span>')
    .replace(/\{blue\}(.+?)\{\/blue\}/g, '<span style="color:#2e01ff;">$1</span>')
    .replace(/\{green\}(.+?)\{\/green\}/g, '<span style="color:#008101;">$1</span>')
    .replace(/\{yellow\}(.+?)\{\/yellow\}/g, '<span style="color:#fffe01;">$1</span>')
    .replace(/\{pink\}(.+?)\{\/pink\}/g, '<span style="color:#fe00fe;">$1</span>')
    .replace(/\{color:(.+?)\}(.+?)\{\/color\}/g, '<span style="color:$1;">$2</span>')
  
    // Background colors
    .replace(/\{bgRed\}(.+?)\{\/bgRed\}/g, '<span style="background-color:#dc2626;">$1</span>')
    .replace(/\{bgGreen\}(.+?)\{\/bgGreen\}/g, '<span style="background-color:#008101;">$1</span>')
    .replace(/\{bgYellow\}(.+?)\{\/bgYellow\}/g, '<span style="background-color:#fffe01;">$1</span>')
    .replace(/\{bgPink\}(.+?)\{\/bgPink\}/g, '<span style="background-color:#fe00fe;">$1</span>')
    .replace(/\{bgBlue\}(.+?)\{\/bgBlue\}/g, '<span style="background-color:#2e01ff;">$1</span>')
    .replace(/\{bgcolor:(.+?)\}(.+?)\{\/bgcolor\}/g, '<span style="background-color:$1;">$2</span>')

    // Font sizes
    .replace(/\{size:(.+?)\}(.+?)\{\/size\}/g, '<span style="font-size:$1;">$2</span>')
    .replace(/\{text-(.+?)\}(.+?)\{\/text-\1\}/g, '<span class="text-$1">$2</span>')

    // Font weight
    .replace(/\{font-(.+?)\}(.+?)\{\/font-\1\}/g, '<span class="font-$1">$2</span>')

    // Underline
    .replace(/\{underline\}(.+?)\{\/underline\}/g, '<u>$1</u>')

    // Alignment
    .replace(/\{align:(left|center|right)\}(.+?)\{\/align\}/g, '<div style="text-align:$1;">$2</div>');

  return (
    <MarkdownRenderer
      content={transformed}
      asInline={true}
      descriptiveText={descriptiveText}
      pClassName={pClassName}
      strongClassName="font-bold"
      liClassName="list-disc ml-5 text-left"
      aClassName={`text-[#2e01ff]  hover:underline ${aClassName} `}
    />
  );
};

export default memo(ColorMarkdownRenderer);

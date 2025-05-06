import TextSpan from '@/components/text/TextSpan';
import {type JSX } from 'react';

interface TextParagraphProps {
  span?: string | JSX.Element;
  text: string;
}
const TextParagraph = ({span, text}: TextParagraphProps) => {
  return (
    <p className="text-sm text-muted-foreground flex">
      {span && <TextSpan text={span} />}
      {text}
    </p>
  );
};

export default TextParagraph;
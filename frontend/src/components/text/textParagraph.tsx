import TextSpan from '@/components/text/TextSpan';

interface TextParagraphProps {
  span?: string;
  text: string;
}
const TextParagraph = ({span, text}: TextParagraphProps) => {
  return (
    <p className="text-sm text-muted-foreground">
      {span && <TextSpan text={span} />}
      {text}
    </p>
  );
};

export default TextParagraph;
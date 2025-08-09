import type { JSX } from 'react'
import { TextSpan } from '@/components/text/TextSpan'

interface TextParagraphProps {
  span?: string | JSX.Element
  text: string
}
export const TextParagraph = ({ span, text }: TextParagraphProps) => {
  return (
    <p className="text-sm text-muted-foreground flex">
      {span && <TextSpan text={span} />}
      {text}
    </p>
  )
}

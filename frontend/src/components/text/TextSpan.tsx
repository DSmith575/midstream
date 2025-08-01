import type { JSX } from 'react'

export const TextSpan = ({ text }: { text: string | JSX.Element }) => {
  return <span className="text-black pr-2">{text}</span>
}

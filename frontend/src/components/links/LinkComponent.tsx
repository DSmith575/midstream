import { Link } from '@tanstack/react-router'

interface LinkComponentProps {
  linkRef: string
  linkName: string
}

export const LinkComponent = ({ linkRef, linkName }: LinkComponentProps) => {
  return (
    <Link
      to={linkRef}
      className={
        'flex w-full items-center justify-center p-2 text-lg font-semibold hover:text-blue-500'
      }
    >
      {linkName}
    </Link>
  )
}

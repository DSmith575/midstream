import { Link } from '@tanstack/react-router'

interface LinkComponentProps {
  linkRef: string
  linkName: string
  onClick?: () => void
}

export const LinkComponent = ({ linkRef, linkName, onClick }: LinkComponentProps) => {
  return (
    <Link
      to={linkRef}
      className={
        'flex w-full items-center justify-center p-2 text-lg font-semibold hover:text-blue-500'
      }
      onClick={onClick}
    >
      {linkName}
    </Link>
  )
}

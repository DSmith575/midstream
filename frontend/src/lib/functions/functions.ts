import { CalendarRange, CreditCard, FileUser, User } from 'lucide-react'

export const splitAndCapitalize = (label: string) => {
  return label
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, (match) => match.toUpperCase())
}

export const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-NZ', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const getUserAge = (dateOfBirth: string) => {
  if (!dateOfBirth) return 'N/A'
  const dob = new Date(dateOfBirth)
  if (Number.isNaN(dob.getTime())) return 'N/A'

  const today = new Date()
  let userAge = today.getFullYear() - dob.getFullYear()

  const hasHadBirthdayThisYear =
    today.getMonth() > dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate())

  if (!hasHadBirthdayThisYear) userAge -= 1

  return userAge.toString()
}

export const getUserInitials = (firstName: string, lastName: string) => {
  return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase().trim()
}

export const getUserAddressLine = (
  address: string,
  city: string,
  country: string,
) => {
  return [address, city, country].filter(Boolean).join(', ')
}

// This function formats a string to PascalCase by replacing camelCase with spaces
export const formatPascalCase = (input: string): string => {
  return input.replace(/([a-z])([A-Z])/g, '$1 $2')
}

export const getIconForKey = (key: string): React.ComponentType => {
  const iconMap: Record<string, React.ComponentType> = {
    Account: User,
    Applications: FileUser,
    Bills: CreditCard,
    Schedule: CalendarRange,
  }

  return iconMap[key] || User
}

export const formatElapsed = (ms: number) => {
  const totalSec = Math.floor(ms / 1000)
  const mm = String(Math.floor(totalSec / 60)).padStart(2, '0')
  const ss = String(totalSec % 60).padStart(2, '0')
  return `${mm}:${ss}`
}

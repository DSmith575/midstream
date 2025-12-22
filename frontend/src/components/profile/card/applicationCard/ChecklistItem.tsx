import type { ReactNode } from 'react'
import { Checkbox } from '@/components/ui/checkbox'

interface ChecklistItemProps {
  checked: boolean
  title: string
  description: string
  icon: ReactNode
}

export const ChecklistItem = ({
  checked,
  title,
  description,
  icon,
}: ChecklistItemProps) => {
  return (
    <label
      className={`${checked ? 'bg-emerald-200' : 'bg-card/80'} flex items-start gap-3 rounded-lg border border-border/50 p-3`}
    >
      <Checkbox checked={checked} disabled />
      <div className="space-y-1 text-sm">
        <div
          className={`flex items-center gap-2 font-semibold text-foreground`}
        >
          {icon} {title}
        </div>
        <p className={`text-muted-foreground text-xs`}>{description}</p>
      </div>
    </label>
  )
}

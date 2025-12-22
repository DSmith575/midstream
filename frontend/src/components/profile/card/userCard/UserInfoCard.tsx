import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

type InfoCardProps = {
  icon: LucideIcon
  label: string
  children: ReactNode
}

export const UserInfoCard = ({
  icon: Icon,
  label,
  children,
}: InfoCardProps) => (
  <div className="rounded-xl border border-border/60 bg-card/80 p-4 shadow-sm backdrop-blur">
    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </div>
    <div className="mt-3 text-sm text-foreground">{children}</div>
  </div>
)

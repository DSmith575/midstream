import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Building2, Mail, MapPin, Phone, User2, UserCog } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { roleConstants } from '@/lib/constants'
import { getUserAge } from '@/lib/functions/functions'
import type { UserProfileProps } from '@/lib/interfaces'

interface CardProps {
  userProfile?: UserProfileProps
}

type InfoCardProps = {
  icon: LucideIcon
  label: string
  children: ReactNode
}

const InfoCard = ({ icon: Icon, label, children }: InfoCardProps) => (
  <div className="rounded-xl border border-border/60 bg-card/80 p-4 shadow-sm backdrop-blur">
    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </div>
    <div className="mt-3 text-sm text-foreground">{children}</div>
  </div>
)

type StatPillProps = {
  label: string
  value?: number
  tone?: 'primary' | 'amber'
}

const StatPill = ({ label, value, tone = 'primary' }: StatPillProps) => {
  const palette =
    tone === 'amber'
      ? 'border-amber-200 bg-amber-50 text-amber-700'
      : 'border-primary/20 bg-primary/5 text-primary'

  return (
    <div className={`rounded-xl border ${palette} px-4 py-3 shadow-sm`}>
      <p className="text-xs font-semibold uppercase tracking-wide opacity-75">
        {label}
      </p>
      <p className="text-2xl font-bold leading-tight">{value ?? '—'}</p>
    </div>
  )
}

export const UserProfileCard = ({ userProfile }: CardProps) => {
  if (
    !userProfile?.personalInformation ||
    !userProfile?.addressInformation ||
    !userProfile?.contactInformation
  ) {
    return null
  }

  const {
    personalInformation,
    addressInformation,
    contactInformation,
    casesCompleted,
    casesAssigned,
    role,
    company,
  } = userProfile

  const { firstName, lastName, preferredName, dateOfBirth, title } =
    personalInformation
  const initials = `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`
    .toUpperCase()
    .trim()
  const age = getUserAge(dateOfBirth)
  const addressLine = [
    addressInformation.address,
    addressInformation.city,
    addressInformation.country,
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <article className="relative col-span-1 w-full overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xl shadow-primary/10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/20"
      />

      <div className="relative flex flex-col gap-6 p-6 sm:p-7">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-primary text-lg font-semibold text-primary-foreground shadow-lg shadow-primary/30">
              {initials || '—'}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-semibold leading-tight text-foreground">
                  {title ? `${title} ${firstName} ${lastName}` : `${firstName} ${lastName}`}
                </h1>
                <Badge className="border-primary/20 bg-primary/10 text-primary">
                  {role || 'Member'}
                </Badge>
                {company?.name && (
                  <Badge variant="outline" className="border-dashed border-border/70 text-muted-foreground">
                    {company.name}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {preferredName && <span>Goes by {preferredName} · </span>}Age {age}
              </p>
            </div>
          </div>

          <Button
            size="icon"
            variant="outline"
            className="border-primary/30 bg-white/80 text-primary shadow-sm transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <UserCog className="h-5 w-5" />
          </Button>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <InfoCard icon={User2} label="Personal">
            <p className="text-base font-semibold">{firstName} {lastName}</p>
            <p className="text-sm text-muted-foreground">Age {age}</p>
          </InfoCard>

          <InfoCard icon={Phone} label="Contact">
            <div className="flex items-center gap-2 text-foreground">
              <Phone className="h-4 w-4 text-primary" />
              <span>{contactInformation.phone}</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-foreground">
              <Mail className="h-4 w-4 text-primary" />
              <span className="break-all">{contactInformation.email}</span>
            </div>
          </InfoCard>

          <InfoCard icon={MapPin} label="Location">
            <div className="flex items-start gap-2 text-foreground">
              <MapPin className="mt-0.5 h-4 w-4 text-primary" />
              <div className="space-y-1">
                <p>{addressLine}</p>
                <p className="text-muted-foreground">
                  {addressInformation.suburb}, {addressInformation.postCode}
                </p>
              </div>
            </div>
          </InfoCard>
        </section>

        {role === roleConstants.worker && (
          <section className="rounded-xl border border-border/70 bg-card/90 p-4 shadow-sm backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Building2 className="h-4 w-4 text-primary" />
                <span>Workload snapshot</span>
              </div>
              <Badge variant="outline" className="border-primary/30 text-primary">
                Worker view
              </Badge>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <StatPill label="Cases completed" value={casesCompleted} />
              <StatPill label="Cases assigned" value={casesAssigned} tone="amber" />
            </div>
          </section>
        )}
      </div>
    </article>
  )
}

import { Link } from '@tanstack/react-router'
import { routeConstants } from '@/lib/constants'
import { Button } from '@/components/ui/button'

type ApplicationCardHeaderProps = {
  userId: string
}

export const ApplicationCardHeader = ({
  userId,
}: ApplicationCardHeaderProps) => {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border/70 px-6 py-5  bg-linear-to-br from-primary/10 via-background to-secondary/20">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Referral workflow
        </p>
        <h2 className="text-xl font-semibold text-foreground">
          Forms and follow-ups
        </h2>
        <p className="text-sm text-muted-foreground">
          Create, upload audio, and finish your checklist for each referral.
        </p>
      </div>
      <Button
        asChild
        className="border-primary/30 bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
      >
        <Link to={routeConstants.dashboardReferral} params={{ userId }}>
          New form
        </Link>
      </Button>
    </div>
  )
}

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Building2, MapPin, ChevronRight } from 'lucide-react'
import type { CompanyProps } from '@/lib/interfaces'
import { SpringModal } from '@/components/modal/SpringModal'

export const CompanyCard = ({
  company,
  userId,
}: {
  company: CompanyProps
  userId: string
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="w-full">
      <Card company={company} onClick={() => setIsOpen(true)} />
      <SpringModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        company={company}
        userId={userId}
      />
    </div>
  )
}

const Card = ({
  company,
  onClick,
}: {
  company: CompanyProps
  onClick: () => void
}) => {
  return (
    <motion.button
      whileHover="hover"
      variants={{
        hover: {
          scale: 1.02,
          transition: {
            duration: 0.2,
            ease: 'easeOut',
          },
        },
      }}
      className="relative w-full overflow-hidden rounded-xl border border-border/60 bg-card p-4 shadow-sm transition-colors hover:border-border hover:shadow-md"
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent" />
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center rounded-lg bg-primary/10 p-2 text-primary">
            <Building2 className="h-5 w-5" />
          </span>
          <div className="flex min-w-0 flex-col">
            <motion.h3
              initial={{ scale: 0.98 }}
              variants={{ hover: { scale: 1 } }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="truncate text-left text-lg font-semibold text-foreground"
            >
              {company.name}
            </motion.h3>
            <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" /> {company.city}, {company.country}
            </p>
          </div>
        </div>
        <div className="self-center text-muted-foreground">
          <ChevronRight className="h-5 w-5" />
        </div>
      </div>
    </motion.button>
  )
}

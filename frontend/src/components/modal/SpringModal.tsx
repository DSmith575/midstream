import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Building2 } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import type { CompanyProps } from '@/lib/interfaces'
import { useJoinCompany } from '@/hooks/company/useJoinCompany'
import { Button } from '@/components/ui/button'

interface SpringModalProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  company: CompanyProps
  userId: string
}

export const SpringModal = ({
  isOpen,
  setIsOpen,
  company,
  userId,
}: SpringModalProps) => {
  const navigate = useNavigate()
  const { mutate } = useJoinCompany(userId, () => {
    navigate({ to: `/dashboard` })
  })

  const joinCompanyHandler = (companyId: number, userId: string) => {
    try {
      const data = {
        companyId: companyId,
        userId: userId,
      }

      mutate({ data })
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error joining company:', error.message)
      }
    }
  }

  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 cursor-pointer"
          role="dialog"
          aria-modal="true"
          aria-labelledby="join-company-title"
          aria-describedby="join-company-desc"
        >
          <motion.div
            initial={{ scale: 0.98, y: 6 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.98, y: 6 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl border border-border/70 bg-card p-6 shadow-2xl cursor-default overflow-hidden"
          >
            <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent" />
            <div className="relative z-10">
              <div className="mx-auto mb-3 grid h-16 w-16 place-items-center rounded-xl bg-primary/10 text-primary">
                <Building2 className="h-8 w-8" />
              </div>
              <h3
                id="join-company-title"
                className="mb-1 text-center text-2xl font-semibold text-foreground"
              >
                Join {company.name}
              </h3>
              <p
                id="join-company-desc"
                className="mb-6 text-center text-sm text-muted-foreground"
              >
                Based in {company.city}, {company.country}.
              </p>

              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  className=""
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="border border-primary/20 bg-linear-to-b from-primary/90 to-primary text-primary-foreground shadow-sm hover:shadow-md"
                  onClick={() => {
                    joinCompanyHandler(company.id, userId)
                    setIsOpen(false)
                  }}
                >
                  Join Company
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

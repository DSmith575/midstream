import { AnimatePresence, motion } from 'framer-motion'
import { CircleAlert } from 'lucide-react'
import type { CompanyProps } from '@/lib/interfaces'

const apiKey = import.meta.env.VITE_API_BACKEND_URL


const SpringModal = ({
  isOpen,
  setIsOpen,
  company,
  userId
}: {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  company: CompanyProps
  userId: string
}) => {
  const joinCompanyHandler = async (companyId: number, userId: string) => {
    try {
      await fetch(`${apiKey}company/joinCompany`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ companyId: companyId, userId: userId }),
      })

    } catch (error) {
      if (error instanceof Error) {
        console.error('Error joining company:', error.message)
      }
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
        >
          <motion.div
            initial={{ scale: 0, rotate: '12.5deg' }}
            animate={{ scale: 1, rotate: '0deg' }}
            exit={{ scale: 0, rotate: '0deg' }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-r from-[#8b5cf6] to-[#59b5e1] text-white p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
          >
            <CircleAlert className="text-white/10 rotate-12 text-[250px] absolute z-0 -top-24 -left-24" />
            <div className="relative z-10">
              <div className="bg-white w-16 h-16 mb-2 rounded-full text-3xl text-indigo-600 grid place-items-center mx-auto">
                <CircleAlert />
              </div>
              <h3 className="text-3xl font-bold text-center mb-2">
                Join {company.name}
              </h3>
              <p className="text-center mb-6">
                Based in {company.city}, {company.country}.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-transparent hover:bg-white/10 transition-colors text-white font-semibold w-full py-2 rounded"
                >
                  Go back
                </button>
                <button
                  onClick={() => {
                    joinCompanyHandler(company.id, userId),
                    setIsOpen(false)
                  }}
                  className="bg-white hover:opacity-90 transition-opacity text-indigo-600 font-semibold w-full py-2 rounded"
                >
                  Join
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export { SpringModal }

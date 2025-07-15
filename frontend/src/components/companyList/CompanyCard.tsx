import { motion } from 'framer-motion'
import { useState } from 'react'
import SpringModal from '../modal/SpringModal'
import type { CompanyProps } from '@/lib/interfaces'

const CompanyCard = ({
  company,
  userId,
}: {
  company: CompanyProps
  userId: string
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mx-auto sm:mx-0 w-fit">
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
          scale: 1.05,
          background: '#59b5e1',
          transition: {
            duration: 0.5,
            ease: 'backInOut',
          },
        },
      }}
      className="relative min-w-[20rem] max-w-[20rem] shrink-0 overflow-hidden rounded-xl bg-indigo-500 p-4 mt-2"
      onClick={onClick}
    >
      <div className="relative z-10 text-white">
        <motion.span
          initial={{ scale: 0.85 }}
          variants={{
            hover: { scale: 0.9 },
          }}
          transition={{ duration: 1, ease: 'backInOut' }}
          className="my-2 inline-block font-mono text-5xl font-black cursor-default"
        >
          {company.name}
        </motion.span>
        <p className="flex justify-end cursor-default">
          {company.city}, {company.country}
        </p>
      </div>
    </motion.button>
  )
}

export default CompanyCard

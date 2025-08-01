import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface MotionContainerProps {
  delta: number
  header: string
  subtitle: string
  children: ReactNode
}

export const MotionContainer = ({
  delta,
  header,
  subtitle,
  children,
}: MotionContainerProps) => {
  return (
    <motion.div
      initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <h2 className="text-base font-semibold leading-7 text-gray-900">
        {header}
      </h2>
      <p className="mt-1 text-sm leading-6 text-gray-600">{subtitle}</p>
      <section className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        {children}
      </section>
    </motion.div>
  )
}

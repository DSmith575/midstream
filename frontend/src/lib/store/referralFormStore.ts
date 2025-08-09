import { Store } from '@tanstack/react-store'
import type { z } from 'zod'
import type { referralFormSchema } from '@/lib/schemas/referralFormSchema'

type ReferralFormType = z.infer<typeof referralFormSchema>

export const referralFormStore = new Store({
  referralFormData: {} as ReferralFormType,
})

export const stepStore = new Store({
  stepIndex: 0,
})

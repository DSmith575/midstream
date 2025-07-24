import { Store } from '@tanstack/react-store'
import { referralFormSchema } from '@/lib/schemas/referralFormSchema'
import { z } from 'zod'

type ReferralFormType = z.infer<typeof referralFormSchema>

export const referralFormStore = new Store({
  referralFormData: {} as ReferralFormType,
})
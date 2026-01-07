import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'
import { referralFormSchema } from '@/lib/schemas/referralFormSchema'
import { referralFormStore } from '@/lib/store/referralFormStore'

// This hook is used to manage the referral form state and validation
export const useReferralForm = () => {
  const form = useForm<z.infer<typeof referralFormSchema>>({
    resolver: zodResolver(referralFormSchema),
    values: referralFormStore.state.referralFormData,
    mode: 'onChange', // Validate on every change for real-time validation
  })

  return form
}

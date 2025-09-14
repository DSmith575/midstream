import { useStore } from '@tanstack/react-store'
import type { z } from 'zod'
import type { referralFormSchema } from '@/lib/schemas/referralFormSchema'
import { stepStore } from '@/lib/store/referralFormStore'
import { referralFormSteps } from '@/lib/formOptions/referralFormOptions'

// This hook is used to manage the steps of the referral form.
// It provides the current step index, next and previous step functions,
// and the fields and metadata for the current step.
export const useReferralFormSteps = () => {
  const stepIndex = useStore(stepStore, (s) => s.stepIndex)

  const next = () =>
    stepStore.setState((s) => ({ ...s, stepIndex: s.stepIndex + 1 }))
  const prev = () =>
    stepStore.setState((s) => ({ ...s, stepIndex: s.stepIndex - 1 }))
  const stepReset = () => stepStore.setState((s) => ({ ...s, stepIndex: 0 }))

  return {
    stepIndex,
    next,
    prev,
    stepReset,
    fields: referralFormSteps[stepIndex].fields as Array<
      keyof z.infer<typeof referralFormSchema>
    >,
    meta: referralFormSteps[stepIndex],
  }
}

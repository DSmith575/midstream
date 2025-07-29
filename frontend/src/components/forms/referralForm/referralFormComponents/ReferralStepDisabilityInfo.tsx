import type { z } from 'zod'
import type { UseFormReturn } from 'react-hook-form'
import type { referralFormSchema } from '@/lib/schemas/referralFormSchema'
import { MotionContainer } from '@/components/animation/MotionContainer'
import { FormInput, FormSelect } from '@/components/forms/formComponents/index'
import { referralFormDisabilityOptions } from '@/lib/formOptions/referralFormOptions'
import { SelectItem } from '@/components/ui/select'

type Inputs = z.infer<typeof referralFormSchema>

export const StepDisabilityInfo = ({
  form,
  delta,
  header,
  subtitle,
}: {
  form: UseFormReturn<Inputs>
  delta: number
  header: string
  subtitle: string
}) => {
  return (
    <MotionContainer delta={delta} header={header} subtitle={subtitle}>
      <FormSelect
        control={form.control}
        fieldName="disabilityType"
        formLabel="Disability Type"
        selectPlaceholder="Select Type"
        children={referralFormDisabilityOptions.map((option, index) => (
          <SelectItem key={index} value={option}>
            {option}
          </SelectItem>
        ))}
      />
      <FormInput
        control={form.control}
        fieldName="disabilityDetails"
        formLabel="Disability Details/Other Medical/Health Issues (if any)"
        placeholder="Sleep disturbances, Sensory processing issues"
      />
      <FormInput
        control={form.control}
        fieldName="disabilityReasonForReferral"
        formLabel="Reason for Referral"
        placeholder="Please provide a brief description of why you are filling this application."
      />
      <FormInput
        control={form.control}
        fieldName="disabilitySupportRequired"
        formLabel="Support Required"
        placeholder="Please provide a brief description of the support required."
      />
    </MotionContainer>
  )
}

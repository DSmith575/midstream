import type { ReferralFormStepProps } from '@/lib/interfaces'
import { MotionContainer } from '@/components/animation/MotionContainer'
import { FormInput, FormSelect } from '@/components/forms/formComponents/'
import { referralFormDisabilityOptions, yesOrNo } from '@/lib/formOptions/referralFormOptions'
import { SelectItem } from '@/components/ui/select'

const renderSelectOptions = (options: string[]) =>
  options.map((option) => (
    <SelectItem key={option} value={option}>
      {option}
    </SelectItem>
  ))

export const StepDisabilityInfo = ({
  form,
  delta,
  header,
  subtitle,
}: ReferralFormStepProps) => {
  return (
    <MotionContainer delta={delta} header={header} subtitle={subtitle}>
      <FormSelect
        control={form.control}
        fieldName="disabilityType"
        formLabel="Disability Type"
        selectPlaceholder="Select Type"
        children={renderSelectOptions(referralFormDisabilityOptions)}
      />
      <FormInput
        control={form.control}
        fieldName="disabilityDetails"
        formLabel="Disability Details/Other Medical/Health Issues (if any)"
        placeholder="Sleep disturbances, Sensory processing issues"
      />
      <FormSelect
        control={form.control}
        fieldName="hasMobilityIssues"
        formLabel="Does the person have mobility issues?"
        selectPlaceholder="Select Yes or No"
        children={renderSelectOptions(yesOrNo)}
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

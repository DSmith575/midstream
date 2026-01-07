import type { ReferralFormStepProps } from '@/lib/interfaces'
import { MotionContainer } from '@/components/animation/MotionContainer'
import { FormInput, FormSelect } from '@/components/forms/formComponents/'
import { referrerRelationshipOptions } from '@/lib/formOptions/referralFormOptions'
import { SelectItem } from '@/components/ui/select'

const renderSelectOptions = (options: string[]) =>
  options.map((option) => (
    <SelectItem key={option} value={option}>
      {option}
    </SelectItem>
  ))

export const StepEmergencyContactInfo = ({
  form,
  delta,
  header,
  subtitle,
}: ReferralFormStepProps) => {
  return (
    <MotionContainer delta={delta} header={header} subtitle={subtitle}>
      <FormInput
        control={form.control}
        fieldName="emergencyContactFirstName"
        formLabel="Referrer First Name"
      />
      <FormInput
        control={form.control}
        fieldName="emergencyContactLastName"
        formLabel="Referrer Last Name"
      />
      <FormInput
        control={form.control}
        fieldName="emergencyContactEmail"
        formLabel="Referrer Email"
      />
      <FormInput
        control={form.control}
        fieldName="emergencyContactPhone"
        formLabel="Referrer Phone"
      />
      <FormSelect
        control={form.control}
        fieldName="emergencyContactRelationship"
        formLabel="Relationship"
        selectPlaceholder="Select Relationship"
        children={renderSelectOptions(referrerRelationshipOptions)}
      />
    </MotionContainer>
  )
}

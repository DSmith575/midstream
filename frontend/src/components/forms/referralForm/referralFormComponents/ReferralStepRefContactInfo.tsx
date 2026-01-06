import type { ReferralFormStepProps } from '@/lib/interfaces'
import { referrerRelationshipOptions } from '@/lib/formOptions/referralFormOptions'
import { MotionContainer } from '@/components/animation/MotionContainer'
import { FormInput, FormSelect } from '@/components/forms/formComponents/'
import { SelectItem } from '@/components/ui/select'

const renderSelectOptions = (options: string[]) =>
  options.map((option) => (
    <SelectItem key={option} value={option}>
      {option}
    </SelectItem>
  ))

export const StepReferralContactInfo = ({ form, delta, header, subtitle }: ReferralFormStepProps) => {
  return (
    <MotionContainer delta={delta} header={header} subtitle={subtitle}>
      <FormInput
        control={form.control}
        fieldName="referrerFirstName"
        formLabel="Referrer First Name"
      />
      <FormInput
        control={form.control}
        fieldName="referrerLastName"
        formLabel="Referrer Last Name"
      />
      <FormInput
        control={form.control}
        fieldName="referrerEmail"
        formLabel="Referrer Email"
      />
      <FormInput
        control={form.control}
        fieldName="referrerPhone"
        formLabel="Referrer Phone"
      />
      <FormSelect
        control={form.control}
        fieldName="referrerRelationship"
        formLabel="Referrer Relationship"
        selectPlaceholder="Select Relationship"
        children={renderSelectOptions(referrerRelationshipOptions)}
      />
    </MotionContainer>
  )
}

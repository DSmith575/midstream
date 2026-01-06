import type { ReferralFormStepProps } from '@/lib/interfaces'
import { MotionContainer } from '@/components/animation/MotionContainer'
import { FormSelect, FormTextArea } from '@/components/forms/formComponents/'
import { SelectItem } from '@/components/ui/select'
import {
  referralFormFirstLanguageOptions,
  yesOrNo,
} from '@/lib/formOptions/referralFormOptions'

const renderSelectOptions = (options: string[]) =>
  options.map((option) => (
    <SelectItem key={option} value={option}>
      {option}
    </SelectItem>
  ))

export const StepLanguageInfo = ({
  form,
  delta,
  communicationNeedsValue,
  header,
  subtitle,
}: ReferralFormStepProps) => {
  return (
    <MotionContainer delta={delta} header={header} subtitle={subtitle}>
      <FormSelect
        control={form.control}
        fieldName="firstLanguage"
        formLabel="First Language"
        selectPlaceholder="Select Language"
        children={renderSelectOptions(referralFormFirstLanguageOptions)}
      />

      <FormSelect
        control={form.control}
        fieldName="interpreter"
        formLabel="Interpreter"
        selectPlaceholder="Select Option"
        children={renderSelectOptions(yesOrNo)}
      />

      <FormSelect
        control={form.control}
        fieldName="culturalSupport"
        formLabel="Cultural Support"
        selectPlaceholder="Select Option"
        children={renderSelectOptions(yesOrNo)}
      />

      <FormSelect
        control={form.control}
        fieldName="communicationNeeds"
        formLabel="Communication Needs"
        selectPlaceholder="Select Option"
        children={renderSelectOptions(yesOrNo)}
      />
      {communicationNeedsValue === 'Yes' && (
        <FormTextArea
          control={form.control}
          fieldName="communicationNeedsDetails"
          formLabel="Communication Needs Details"
          placeholder="Non-verbal communication (e.g., requires anticipation and support)"
        />
      )}
    </MotionContainer>
  )
}

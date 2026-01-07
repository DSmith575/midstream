import type { ReferralFormStepProps } from '@/lib/interfaces'
import { yesOrNo } from '@/lib/formOptions/referralFormOptions'
import { MotionContainer } from '@/components/animation/MotionContainer'
import { FormSelect } from '@/components/forms/formComponents/'
import { SelectItem } from '@/components/ui/select'

const renderSelectOptions = (options: string[]) =>
  options.map((option) => (
    <SelectItem key={option} value={option}>
      {option}
    </SelectItem>
  ))

export const StepConsentInfo = ({
  form,
  delta,
  header,
  subtitle,
}: ReferralFormStepProps) => {
  return (
    <MotionContainer delta={delta} header={header} subtitle={subtitle}>
      <FormSelect
        control={form.control}
        fieldName="provideInformation"
        formLabel="Consent to Provide Information"
        selectPlaceholder="Select Option"
        children={renderSelectOptions(yesOrNo)}
      />
      <FormSelect
        control={form.control}
        fieldName="shareInformation"
        formLabel="Consent to Share Information for assessment"
        selectPlaceholder="Select Option"
        children={renderSelectOptions(yesOrNo)}
      />
      <FormSelect
        control={form.control}
        fieldName="contactedForAdditionalInformation"
        formLabel="Consent to Be Contacted for Verification/Additional Information"
        selectPlaceholder="Select Option"
        children={renderSelectOptions(yesOrNo)}
      />
      <FormSelect
        control={form.control}
        fieldName="statisticalInformation"
        formLabel="Consent to Share Information for statistical purposes"
        selectPlaceholder="Select Option"
        children={renderSelectOptions(yesOrNo)}
      />

      <FormSelect
        control={form.control}
        fieldName="correctInformationProvided"
        formLabel="Consent to Confirm Information Provided is Correct"
        selectPlaceholder="Select Option"
        children={renderSelectOptions(yesOrNo)}
      />
    </MotionContainer>
  )
}

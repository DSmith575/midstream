import type { ReferralFormStepProps } from '@/lib/interfaces'
import { MotionContainer } from '@/components/animation/MotionContainer'
import { FormTextArea } from '@/components/forms/formComponents/'

export const StepAdditionalInfo = ({
  form,
  delta,
  header,
  subtitle,
}: ReferralFormStepProps) => {
  return (
    <MotionContainer delta={delta} header={header} subtitle={subtitle}>
      <FormTextArea
        control={form.control}
        height="h-20"
        fieldName="safety"
        formLabel="Safety, Hazards, or Sensitive Issues"
        placeholder="Tendency to wander off"
      />
      <FormTextArea
        control={form.control}
        height="h-20"
        fieldName="otherImportantInformation"
        formLabel="Other Important Information"
        placeholder="Requires a high level of support for daily living tasks"
      />
    </MotionContainer>
  )
}

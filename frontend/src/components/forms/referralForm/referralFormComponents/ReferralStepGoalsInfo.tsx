import type { ReferralFormStepProps } from '@/lib/interfaces'
import { MotionContainer } from '@/components/animation/MotionContainer'
import { FormTextArea } from '@/components/forms/formComponents/'

export const StepGoalsInfo = ({
  form,
  delta,
  header,
  subtitle,
}: ReferralFormStepProps) => {
  return (
    <MotionContainer delta={delta} header={header} subtitle={subtitle}>
      <FormTextArea
        control={form.control}
        fieldName="whanauGoal"
        formLabel="What is the whanau/person goal?"
        placeholder='Enter the whanau/person goal here...'
      />
      <FormTextArea
        control={form.control}
        fieldName="aspiration"
        formLabel="What is your aspiration?"
        placeholder='Enter your aspiration here...'
      />
      <FormTextArea
        control={form.control}
        fieldName="biggestBarrier"
        formLabel="What is the biggest thing holding you back or biggest barrier?"
        placeholder='Enter the biggest barrier here...'
      />
    </MotionContainer>
  )
}

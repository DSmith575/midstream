import { FormProvider } from 'react-hook-form'

import { referralFormSteps } from '@/lib/formOptions/referralFormOptions'
import {
  StepAdditionalInfo,
  StepConsentInfo,
  StepDisabilityInfo,
  StepEmergencyContactInfo,
  StepLanguageInfo,
  StepMedicalInfo,
  StepPersonalInfo,
  StepReferralContactInfo,
} from '@/components/forms/referralForm/referralFormComponents'

import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'

import { FormStepNavigation } from '@/components/forms/formComponents'

import {
  useIsReferralFormComplete,
  usePreloadedUserReferralData,
  useReferralForm,
  useReferralFormSteps,
  useSubmitReferralForm,
} from '@/hooks/referralForms/'

const stepComponents = [
  StepPersonalInfo,
  StepLanguageInfo,
  StepMedicalInfo,
  StepDisabilityInfo,
  StepAdditionalInfo,
  StepReferralContactInfo,
  StepEmergencyContactInfo,
  StepConsentInfo,
] as const

export const ReferralForm = () => {
  const { userId, userData } = usePreloadedUserReferralData()
  const form = useReferralForm()
  const { stepIndex, next, prev, fields, meta } = useReferralFormSteps()
  const CurrentStep = stepComponents[stepIndex]
  const isFormComplete = useIsReferralFormComplete(form)
  const { submit, isPending } = useSubmitReferralForm(
    userId as string,
    userData,
  )

  const onNext = async () => {
    const valid = await form.trigger(fields)
    if (valid) next()
  }

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submit)} className="space-y-6 mx-2">
          <FormStepNavigation
            steps={referralFormSteps}
            currentStep={stepIndex}
          />
          <CurrentStep
            form={form}
            delta={1}
            header={meta.name}
            subtitle={meta.subtitle}
            communicationNeedsValue={form.watch('communicationNeeds') || ''}
          />
          <div className="flex justify-between mx-4">
            <Button
              type="button"
              onClick={prev}
              disabled={stepIndex === 0}
              variant="secondary"
            >
              Back
            </Button>
            {stepIndex === stepComponents.length - 1 ? (
              <Button
                type="submit"
                disabled={!isFormComplete || isPending}
                className={
                  !isFormComplete ? 'opacity-50 cursor-not-allowed' : ''
                }
              >
                {isPending ? 'Submitting...' : 'Submit'}
              </Button>
            ) : (
              <Button type="button" onClick={onNext}>
                Next
              </Button>
            )}
          </div>
        </form>
      </Form>
    </FormProvider>
  )
}
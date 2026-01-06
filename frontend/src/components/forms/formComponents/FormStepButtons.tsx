import { Button } from '@/components/ui/button'

interface FormStepButtonsProps {
  currentStep: number
  stepsLength: number
  onClickPrev: () => void
  onClickNext: () => void
  prevButtonText?: string
  nextButtonText?: string
  submitButtonText?: string
  isSubmitting?: boolean
}

export const FormStepButtons = ({
  currentStep,
  stepsLength,
  onClickPrev,
  onClickNext,
  prevButtonText = 'Previous',
  nextButtonText = 'Next',
  submitButtonText = 'Submit',
  isSubmitting = false,
}: FormStepButtonsProps) => {
  const isLastStep = currentStep === stepsLength - 1

  return (
    <section className="mt-8 pt-5">
      <div className="flex justify-between">
        {currentStep > 0 && (
          <Button type="button" onClick={onClickPrev} variant="outline">
            {prevButtonText}
          </Button>
        )}

        {!isLastStep && (
          <Button type="button" onClick={onClickNext} variant="outline">
            {nextButtonText}
          </Button>
        )}

        {isLastStep && (
          <Button type="submit" disabled={isSubmitting} variant="outline">
            {submitButtonText}
          </Button>
        )}
      </div>
    </section>
  )
}

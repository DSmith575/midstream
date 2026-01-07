interface StepNavigationProps {
  steps: Array<{ id: string; name: string }>
  currentStep: number
}

const getStepClasses = (stepIndex: number, currentStep: number) => {
  const isCompleted = currentStep > stepIndex
  const isCurrent = currentStep === stepIndex

  const borderColor =
    isCompleted || isCurrent ? 'border-sky-600' : 'border-gray-200'
  const textColor = isCompleted || isCurrent ? 'text-sky-600' : 'text-gray-500'
  const baseClasses = `flex w-full flex-col border-l-4 ${borderColor} py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4`
  const groupClass = !isCurrent ? 'group' : ''

  return { baseClasses: `${baseClasses} ${groupClass}`.trim(), textColor }
}

const StepItem = ({
  step,
  index,
  currentStep,
}: {
  step: { id: string; name: string }
  index: number
  currentStep: number
}) => {
  const { baseClasses, textColor } = getStepClasses(index, currentStep)
  const isCurrent = currentStep === index

  return (
    <li key={step.name} className="md:flex-1">
      <div
        className={baseClasses}
        {...(isCurrent && { 'aria-current': 'step' })}
      >
        <span className={`text-sm font-medium ${textColor}`}>{step.id}</span>
        <span className="text-sm font-medium">{step.name}</span>
      </div>
    </li>
  )
}

export const FormStepNavigation = ({
  steps,
  currentStep,
}: StepNavigationProps) => {
  return (
    <nav aria-label="Progress" className="mb-8 mt-4 mx-4">
      <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
        {steps.map((step, index) => (
          <StepItem
            key={step.name}
            step={step}
            index={index}
            currentStep={currentStep}
          />
        ))}
      </ol>
    </nav>
  )
}

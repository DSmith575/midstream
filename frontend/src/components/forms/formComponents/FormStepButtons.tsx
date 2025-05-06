import { Button } from "@/components/ui/button";

interface FormStepButtonsProps {
  currentStep: number;
  profileFormStepsLength: number;
  prevButtonType: "submit" | "reset" | "button"
  nextButtonType: "submit" | "reset" | "button"
  submitButtonType: "submit" | "reset" | "button"
  onClickPrev: () => void;
  onClickNext: () => void;
  prevButtonText: string;
  nextButtonText: string;
  submitButtonText: string;
}

const FormStepButtons = ({currentStep, profileFormStepsLength, prevButtonType, nextButtonType, submitButtonType, onClickPrev, onClickNext, prevButtonText, nextButtonText, submitButtonText}: FormStepButtonsProps) => {
  return (
    <section className={"mt-8 pt-5"}>
      <div className={"flex justify-between"}>
        {currentStep > 0 && (
          <Button type={prevButtonType} onClick={onClickPrev} variant={"outline"}>
            {prevButtonText}
          </Button>
        )}

        {currentStep < profileFormStepsLength - 1 && (
          <Button type={nextButtonType} onClick={onClickNext} variant={"outline"}>
            {nextButtonText}
          </Button>
        )}

        {currentStep === profileFormStepsLength - 1 && (
          <Button type={submitButtonType} variant={"outline"}>
            {submitButtonText}
          </Button>
        )}
      </div>
    </section>
  )
};

export default FormStepButtons;
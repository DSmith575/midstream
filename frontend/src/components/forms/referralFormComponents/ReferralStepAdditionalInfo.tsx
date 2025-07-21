import type { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { referralFormSchema } from "@/lib/schemas/referralFormSchema";
import {MotionContainer} from "@/components/animation/MotionContainer";
import { FormTextArea } from "@/components/forms/formComponents/index";
type Inputs = z.infer<typeof referralFormSchema>;

const StepAdditionalInfo = ({
  form,
  delta,
  header,
  subtitle,
}: {
  form: UseFormReturn<Inputs>;
  delta: number;
  header: string;
  subtitle: string;
}) => {
  return (
    <MotionContainer delta={delta} header={header} subtitle={subtitle}>
      <FormTextArea control={form.control} height={'h-20'} fieldName="safety" formLabel="Safety, Hazards, or Sensitive Issues" placeholder="Tendency to wander off" />
      <FormTextArea control={form.control} height={'h-20'} fieldName="otherImportantInformation" formLabel="Other Important Information" placeholder="Requires a high level of support for daily living tasks" />
    </MotionContainer>
  );
};

export { StepAdditionalInfo };

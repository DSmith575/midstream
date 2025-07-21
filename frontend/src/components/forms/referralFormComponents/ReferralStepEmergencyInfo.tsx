import type { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { referralFormSchema } from "@/lib/schemas/referralFormSchema";
import {MotionContainer} from "@/components/animation/MotionContainer";
import { FormSelect, FormInput } from "@/components/forms/formComponents/index";;
import { referrerRelationshipOptions } from "@/lib/formOptions/referralFormOptions";
import { SelectItem } from "@/components/ui/select";

type Inputs = z.infer<typeof referralFormSchema>;

const StepEmergencyContactInfo = ({ form, delta, header, subtitle }: { form: UseFormReturn<Inputs>; delta: number; header:string; subtitle: string; }) => {
	return (
		<MotionContainer delta={delta} header={header} subtitle={subtitle}>
		<FormInput control={form.control} fieldName="emergencyContactFirstName" formLabel="Referrer First Name" />
    <FormInput control={form.control} fieldName="emergencyContactLastName" formLabel="Referrer Last Name" />
    <FormInput control={form.control} fieldName="emergencyContactEmail" formLabel="Referrer Email" />
    <FormInput control={form.control} fieldName="emergencyContactPhone" formLabel="Referrer Phone" />
    <FormSelect
      control={form.control}
      fieldName="emergencyContactRelationship"
      formLabel="Relationship"
      selectPlaceholder="Select Relationship"
      children={referrerRelationshipOptions.map((option, index) => (
        <SelectItem key={index} value={option}>
          {option}
        </SelectItem>
      ))}
    />
	</MotionContainer>
	)
};


export { StepEmergencyContactInfo };
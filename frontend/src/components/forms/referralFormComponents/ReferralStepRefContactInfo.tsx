import type { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { referralFormSchema } from "@/lib/schemas/referralFormSchema";
import { referrerRelationshipOptions } from "@/lib/formOptions/referralFormOptions";
import {MotionContainer} from "@/components/animation/MotionContainer";
import { FormInput, FormSelect } from "@/components/forms/formComponents/index";;
import { SelectItem } from "@/components/ui/select";

type Inputs = z.infer<typeof referralFormSchema>;

const StepReferralContactInfo = ({ form, delta, header, subtitle }: { form: UseFormReturn<Inputs>; delta: number; header:string; subtitle: string; }) => {
	return (
		<MotionContainer delta={delta} header={header} subtitle={subtitle}>
		<FormInput control={form.control} fieldName="referrerFirstName" formLabel="Referrer First Name" />
    <FormInput control={form.control} fieldName="referrerLastName" formLabel="Referrer Last Name" />
    <FormInput control={form.control} fieldName="referrerEmail" formLabel="Referrer Email" />
    <FormInput control={form.control} fieldName="referrerPhone" formLabel="Referrer Phone" />
    <FormSelect
      control={form.control}
      fieldName="referrerRelationship"
      formLabel="Referrer Relationship"
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


export { StepReferralContactInfo };
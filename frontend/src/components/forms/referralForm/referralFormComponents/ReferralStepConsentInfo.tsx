import type { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { referralFormSchema } from "@/lib/schemas/referralFormSchema";
import { yesOrNo } from "@/lib/formOptions/referralFormOptions";
import MotionContainer from "@/components/animation/MotionContainer";
import FormSelect from "@/components/forms/formComponents/FormSelect";
import { SelectItem } from "@/components/ui/select";

type Inputs = z.infer<typeof referralFormSchema>;

const StepConsentInfo = ({ form, delta, header, subtitle }: { form: UseFormReturn<Inputs>; delta: number; header:string; subtitle: string; }) => {
	return (
		<MotionContainer delta={delta} header={header} subtitle={subtitle}>
    <FormSelect
      control={form.control}
      fieldName="provideInformation"
      formLabel="Consent to Provide Information"
      selectPlaceholder="Select Option"
      children={yesOrNo.map((option, index) => (
        <SelectItem key={index} value={option}>
          {option}
        </SelectItem>
      ))}
    />
     <FormSelect
      control={form.control}
      fieldName="shareInformation"
      formLabel="Consent to Share Information for assessment"
      selectPlaceholder="Select Option"
      children={yesOrNo.map((option, index) => (
        <SelectItem key={index} value={option}>
          {option}
        </SelectItem>
      ))}
    />
         <FormSelect
      control={form.control}
      fieldName="contactedForAdditionalInformation"
      formLabel="Consent to Be Contacted for Verification/Additional Information"
      selectPlaceholder="Select Option"
      children={yesOrNo.map((option, index) => (
        <SelectItem key={index} value={option}>
          {option}
        </SelectItem>
      ))}
    />
             <FormSelect
      control={form.control}
      fieldName="statisticalInformation"
      formLabel="Consent to Share Information for statistical purposes"
      selectPlaceholder="Select Option"
      children={yesOrNo.map((option, index) => (
        <SelectItem key={index} value={option}>
          {option}
        </SelectItem>
      ))}
    />

<FormSelect
      control={form.control}
      fieldName="correctInformationProvided"
      formLabel="Consent to Confirm Information Provided is Correct"
      selectPlaceholder="Select Option"
      children={yesOrNo.map((option, index) => (
        <SelectItem key={index} value={option}>
          {option}
        </SelectItem>
      ))}
    />
	</MotionContainer>
	)
};


export default StepConsentInfo;
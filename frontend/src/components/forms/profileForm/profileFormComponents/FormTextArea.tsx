import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Control, FieldValues, Path } from "react-hook-form";

interface FormTextAreaProps<T extends FieldValues> {
  control: Control<T>;
  fieldName: Path<T>;
  formLabel: string;
  placeholder: string;
};

const FormTextArea = <T extends FieldValues>({control, fieldName, formLabel, placeholder}: FormTextAreaProps<T>) => {
  return (
    <div className={"sm:col-span-3"}>
      <FormField
        control={control}
        name={fieldName}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{formLabel}</FormLabel>
            <FormControl>
            <Textarea
            className={"resize-none h-32"}
              placeholder={placeholder}
              {...field}
            />
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}
      />
    </div>
  )
};

export default FormTextArea;
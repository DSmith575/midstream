import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control, FieldValues, Path } from "react-hook-form";

interface FormInputProps<T extends FieldValues> {
  control: Control<T>;
  fieldName: Path<T>;
  formLabel: string;
  placeholder?: string;
  type?: string;
}

const FormInput = <T extends FieldValues>({
  control,
  fieldName,
  formLabel,
  placeholder = "",
  type = "text",
}: FormInputProps<T>) => {
  return (
    <div className={"sm:col-span-3"}>
      <FormField
        control={control}
        name={fieldName}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{formLabel}</FormLabel>
            <FormControl>
              <Input
                type={type}
                placeholder={placeholder}
                {...field}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default FormInput;

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select } from "@/components/ui/select";
import { SelectContent, SelectTrigger, SelectValue, SelectGroup } from "@/components/ui/select";
import { ReactNode } from "react";
import { Control, FieldValues, Path } from "react-hook-form";

interface FormSelectProps<T extends FieldValues> {
  control: Control<T>;
  fieldName: Path<T>;
  formLabel: string;
  selectPlaceholder: string;
  children: ReactNode;
};

const FormSelect = <T extends FieldValues>({control, fieldName, formLabel, selectPlaceholder, children}: FormSelectProps<T>) => {
  return (
    <div className={"sm:col-span-3"}>
      <FormField
      control={control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{formLabel}</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={selectPlaceholder}/>
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                {children}
              </SelectGroup>
            </SelectContent>
          </Select>
          <FormMessage/>
        </FormItem>
      )}
      />
    </div>
  )
};

export default FormSelect;
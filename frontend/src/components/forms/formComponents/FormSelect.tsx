import type { ReactNode } from 'react'
import type { Control, FieldValues, Path } from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface FormSelectProps<T extends FieldValues> {
  control: Control<T>
  fieldName: Path<T>
  formLabel: string
  selectPlaceholder: string
  children: ReactNode
}

export const FormSelect = <T extends FieldValues>({
  control,
  fieldName,
  formLabel,
  selectPlaceholder,
  children,
}: FormSelectProps<T>) => {
  return (
    <div className={'sm:col-span-3'}>
      <FormField
        control={control}
        name={fieldName}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{formLabel}</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={selectPlaceholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectGroup>{children}</SelectGroup>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

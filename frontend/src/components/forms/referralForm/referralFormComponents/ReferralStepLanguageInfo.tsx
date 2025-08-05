import type { z } from 'zod'
import type { UseFormReturn } from 'react-hook-form'
import type { referralFormSchema } from '@/lib/schemas/referralFormSchema'
import { MotionContainer } from '@/components/animation/MotionContainer'
import { FormSelect, FormTextArea } from '@/components/forms/formComponents/'
import { SelectItem } from '@/components/ui/select'
import {
  referralFormFirstLanguageOptions,
  yesOrNo,
} from '@/lib/formOptions/referralFormOptions'

type Inputs = z.infer<typeof referralFormSchema>

export const StepLanguageInfo = ({
  form,
  delta,
  communicationNeedsValue,
  header,
  subtitle,
}: {
  form: UseFormReturn<Inputs>
  delta: number
  communicationNeedsValue: string
  header: string
  subtitle: string
}) => {
  return (
    <MotionContainer delta={delta} header={header} subtitle={subtitle}>
      <FormSelect
        control={form.control}
        fieldName={'firstLanguage'}
        formLabel={'First Language'}
        selectPlaceholder="Select Language"
        children={referralFormFirstLanguageOptions.map((option, index) => (
          <SelectItem key={index} value={option}>
            {option}
          </SelectItem>
        ))}
      />

      <FormSelect
        control={form.control}
        fieldName={'interpreter'}
        formLabel={'Interpreter'}
        selectPlaceholder={'Select Option'}
        children={yesOrNo.map((option, index) => (
          <SelectItem key={index} value={option}>
            {option}
          </SelectItem>
        ))}
      />

      <FormSelect
        control={form.control}
        fieldName={'culturalSupport'}
        formLabel={'Cultural Support'}
        selectPlaceholder={'Select Option'}
        children={yesOrNo.map((option, index) => (
          <SelectItem key={index} value={option}>
            {option}
          </SelectItem>
        ))}
      />
      <FormSelect
        control={form.control}
        fieldName={'communicationNeeds'}
        formLabel={'Communication Needs'}
        selectPlaceholder={'Select Option'}
        children={yesOrNo.map((option, index) => (
          <SelectItem key={index} value={option}>
            {option}
          </SelectItem>
        ))}
      />
      {communicationNeedsValue === 'Yes' && (
        <FormTextArea
          control={form.control}
          fieldName={'communicationNeedsDetails'}
          formLabel={'Communication Needs Details'}
          placeholder={
            'Non-verbal communication (e.g., requires anticipation and support)'
          }
        />
      )}
    </MotionContainer>
  )
}

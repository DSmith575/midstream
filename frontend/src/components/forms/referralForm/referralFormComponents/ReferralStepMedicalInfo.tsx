import type { z } from 'zod'
import type { UseFormReturn } from 'react-hook-form'
import type { referralFormSchema } from '@/lib/schemas/referralFormSchema'
import { MotionContainer } from '@/components/animation/MotionContainer'
import { FormInput } from '@/components/forms/formComponents/'

type Inputs = z.infer<typeof referralFormSchema>

export const StepMedicalInfo = ({
  form,
  delta,
  header,
  subtitle,
}: {
  form: UseFormReturn<Inputs>
  delta: number
  header: string
  subtitle: string
}) => {
  return (
    <MotionContainer delta={delta} header={header} subtitle={subtitle}>
      <FormInput
        control={form.control}
        fieldName="doctorName"
        formLabel="Doctor/GP Name"
        placeholder="Enter Doctor/GP Name"
      />
      <FormInput
        control={form.control}
        fieldName="doctorPhone"
        formLabel="Medical Centre Contact Number"
        placeholder="Enter Medical Centre Contact Number"
      />
      <FormInput
        control={form.control}
        fieldName="doctorAddress"
        formLabel="Medical Centre Address"
        placeholder="Enter Medical Centre Address"
      />
      <FormInput
        control={form.control}
        fieldName="doctorSuburb"
        formLabel="Medical Centre Suburb"
        placeholder="Enter Medical Centre Suburb"
      />
      <FormInput
        control={form.control}
        fieldName="doctorCity"
        formLabel="Medical Centre City"
        placeholder="Enter Medical Centre City"
      />
      <FormInput
        control={form.control}
        fieldName="nationalHealthIndex"
        formLabel="NHI Number"
        placeholder="X12345"
      />
    </MotionContainer>
  )
}

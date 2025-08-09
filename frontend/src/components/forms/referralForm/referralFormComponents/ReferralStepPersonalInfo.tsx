import type { z } from 'zod'
import type { UseFormReturn } from 'react-hook-form'
import type { referralFormSchema } from '@/lib/schemas/referralFormSchema'
import { MotionContainer } from '@/components/animation/MotionContainer'
import { FormInput } from '@/components/forms/formComponents/'

type Inputs = z.infer<typeof referralFormSchema>

export const StepPersonalInfo = ({
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
        fieldName="firstName"
        formLabel="First Name"
        disabled
      />
      <FormInput
        control={form.control}
        fieldName="lastName"
        formLabel="Last Name"
        disabled
      />
      <FormInput
        control={form.control}
        fieldName="title"
        formLabel="Title"
        disabled
      />
      <FormInput
        control={form.control}
        fieldName="preferredName"
        formLabel="Preferred Name"
        disabled
      />
      <FormInput
        control={form.control}
        fieldName="dateOfBirth"
        formLabel="Date of Birth"
        disabled
      />
      <FormInput
        control={form.control}
        fieldName="gender"
        formLabel="Gender"
        disabled
      />
      <FormInput
        control={form.control}
        fieldName="email"
        formLabel="Email"
        disabled
      />
      <FormInput
        control={form.control}
        fieldName="phone"
        formLabel="Phone"
        disabled
      />
      <FormInput
        control={form.control}
        fieldName="address"
        formLabel="Address"
        disabled
      />
      <FormInput
        control={form.control}
        fieldName="suburb"
        formLabel="Suburb"
        disabled
      />
      <FormInput
        control={form.control}
        fieldName="city"
        formLabel="City"
        disabled
      />
      <FormInput
        control={form.control}
        fieldName="postCode"
        formLabel="Post Code"
        disabled
      />
      <FormInput
        control={form.control}
        fieldName="country"
        formLabel="Country"
        disabled
      />
    </MotionContainer>
  )
}

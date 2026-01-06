import type { ReferralFormStepProps } from '@/lib/interfaces'
import { MotionContainer } from '@/components/animation/MotionContainer'
import { FormInput } from '@/components/forms/formComponents/'

export const StepPersonalInfo = ({ form, delta, header, subtitle }: ReferralFormStepProps) => {
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

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useUser } from '@clerk/clerk-react'
import { useNavigate } from '@tanstack/react-router'
import type { z } from 'zod'
import type { CreateUserProps } from '@/lib/interfaces'
import { Input } from '@/components/ui/input'
import { SelectItem } from '@/components/ui/select'
import { Form, FormControl, FormItem, FormLabel } from '@/components/ui/form'
import { profileFormSchema } from '@/lib/schemas/profileFormSchema'

import { MotionContainer } from '@/components/animation/MotionContainer'
import {
  genderSelectOptions,
  profileFormSteps,
  titleSelectOptions,
} from '@/lib/formOptions/profileFormOptions'
import {
  FormInput,
  FormSelect,
  FormStepButtons,
  FormStepNavigation,
} from '@/components/forms/formComponents'
import { useCreateUserProfile } from '@/hooks/userProfile/useCreateUserProfile'
import { UploadSpinner } from '@/components/spinner'

type Inputs = z.infer<typeof profileFormSchema>
type FieldName = keyof Inputs

const renderSelectOptions = (options: string[]) =>
  options.map((option) => (
    <SelectItem key={option} value={option}>
      {option}
    </SelectItem>
  ))

const formatFieldLabel = (fieldName: string): string =>
  fieldName
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, (str) => str.toUpperCase())

export const ProfileForm = () => {
  const user = useUser()
  const navigate = useNavigate()
  const { mutate, isPending } = useCreateUserProfile(
    user.user?.id as string,
    () => {
      navigate({ to: `/dashboard` })
    },
  )

  const form = useForm<Inputs>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      title: '',
      preferredName: '',
      dateOfBirth: '',
      gender: '',
      email: '',
      phone: '',
      address: '',
      suburb: '',
      city: '',
      postCode: '0',
      country: '',
    },
  })

  const { trigger } = form
  const [previousStep, setPreviousStep] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const delta = currentStep - previousStep

  const onSubmit = (values: z.infer<typeof profileFormSchema>) => {
    const googleUserId = user.user?.id
    if (!googleUserId) return

    const userDetails: CreateUserProps = {
      googleId: googleUserId,
      ...values,
    }

    mutate(userDetails)
  }

  const next = async () => {
    const fields = profileFormSteps[currentStep]?.fields

    const output = await trigger(fields as Array<FieldName>, {
      shouldFocus: true,
    })
    if (!output) return

    if (currentStep < profileFormSteps.length - 1) {
      setPreviousStep(currentStep)
      setCurrentStep((step) => step + 1)
    }
  }

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep)
      setCurrentStep((step) => step - 1)
    }
  }

  return (
    <section className="flex flex-col justify-between px-10 py-10">
      {isPending && (
        <UploadSpinner text="Submitting your profile information..." />
      )}

      <FormStepNavigation steps={profileFormSteps} currentStep={currentStep} />

      {/* Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-4 space-y-8 py-4"
        >
          {currentStep === 0 && (
            <MotionContainer
              delta={delta}
              header={profileFormSteps[currentStep].name}
              subtitle={profileFormSteps[currentStep].subtitle}
            >
              <FormInput
                control={form.control}
                fieldName="firstName"
                formLabel="First Name"
                placeholder="John"
              />

              <FormInput
                control={form.control}
                fieldName="lastName"
                formLabel="Last Name"
                placeholder="Doe"
              />

              <FormSelect
                control={form.control}
                fieldName="title"
                formLabel="Title"
                selectPlaceholder="Title"
                children={renderSelectOptions(titleSelectOptions)}
              />

              <FormInput
                control={form.control}
                fieldName="preferredName"
                formLabel="Preferred Name"
                placeholder="Optional"
              />

              <FormInput
                control={form.control}
                fieldName="dateOfBirth"
                formLabel="Date of Birth"
                placeholder="DD/MM/YYYY"
                type="date"
              />

              <FormSelect
                control={form.control}
                fieldName="gender"
                formLabel="Gender"
                selectPlaceholder="Gender"
                children={renderSelectOptions(genderSelectOptions)}
              />
            </MotionContainer>
          )}

          {currentStep === 1 && (
            <MotionContainer
              delta={delta}
              header={profileFormSteps[currentStep].name}
              subtitle={profileFormSteps[currentStep].subtitle}
            >
              <FormInput
                control={form.control}
                fieldName="email"
                formLabel="Email"
                type="email"
                placeholder="JohnDoe@email.com"
              />

              <FormInput
                control={form.control}
                fieldName="phone"
                formLabel="Phone Number"
                placeholder="Home or Mobile"
              />
            </MotionContainer>
          )}

          {currentStep === 2 && (
            <MotionContainer
              delta={delta}
              header={profileFormSteps[currentStep].name}
              subtitle={profileFormSteps[currentStep].subtitle}
            >
              <FormInput
                control={form.control}
                fieldName="address"
                formLabel="Address"
                placeholder="123 Example Street"
              />

              <FormInput
                control={form.control}
                fieldName="suburb"
                formLabel="Suburb"
                placeholder="Richmond"
              />

              <FormInput
                control={form.control}
                fieldName="city"
                formLabel="City"
                placeholder="Christchurch"
              />

              <FormInput
                control={form.control}
                fieldName="postCode"
                formLabel="Post Code"
                placeholder="1234"
                type="string"
              />

              <FormInput
                control={form.control}
                fieldName="country"
                formLabel="Country"
                placeholder="New Zealand"
              />
            </MotionContainer>
          )}

          {currentStep === 3 && (
            <MotionContainer
              delta={delta}
              header={profileFormSteps[currentStep].name}
              subtitle={profileFormSteps[currentStep].subtitle}
            >
              {Object.entries(form.getValues()).map(([key, value]) => (
                <div key={key} className="sm:col-span-3">
                  <FormItem>
                    <FormLabel>{formatFieldLabel(key)}</FormLabel>
                    <FormControl>
                      <Input
                        value={value}
                        readOnly
                        className="block w-full cursor-not-allowed rounded-md border-0 bg-gray-200 py-1.5 text-gray-900 shadow-sm sm:text-sm sm:leading-6"
                      />
                    </FormControl>
                  </FormItem>
                </div>
              ))}
            </MotionContainer>
          )}

          <FormStepButtons
            currentStep={currentStep}
            stepsLength={profileFormSteps.length}
            prevButtonText="Previous"
            nextButtonText="Next"
            submitButtonText={isPending ? 'Submitting' : 'Submit'}
            isSubmitting={isPending}
            onClickPrev={prev}
            onClickNext={next}
          />
        </form>
      </Form>
    </section>
  )
}

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { SelectItem } from '@/components/ui/select'
import { Form, FormControl, FormItem, FormLabel } from '@/components/ui/form'
import { profileFormSchema } from '@/lib/schemas/profileFormSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useUser } from '@clerk/clerk-react'

import { MotionContainer } from '@/components/animation/MotionContainer'
import {
  titleSelectOptions,
  genderSelectOptions,
  profileFormSteps,
} from '@/lib/formOptions/profileFormOptions'
import {
  FormStepButtons,
  FormInput,
  FormSelect,
  FormStepNavigation,
} from '@/components/forms/formComponents/index'
import useCreateUserProfile from '@/hooks/userProfile/useCreateUserProfile'
import type { CreateUserProps } from '@/lib/profileInterfaces'
import { useNavigate } from '@tanstack/react-router'

type Inputs = z.infer<typeof profileFormSchema>
type FieldName = keyof Inputs

const ProfileForm = () => {
  const user = useUser()
  const navigate = useNavigate()
  const { mutate, isPending, isSuccess } = useCreateUserProfile(
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

  const onSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    const googleUserId = user.user?.id
    if (!googleUserId) {
      return
    }
    const userDetails: CreateUserProps = {
      googleId: googleUserId,
      firstName: values.firstName,
      lastName: values.lastName,
      title: values.title,
      preferredName: values.preferredName,
      gender: values.gender,
      dateOfBirth: values.dateOfBirth,
      email: values.email,
      phone: values.phone,
      address: values.address,
      suburb: values.suburb,
      city: values.city,
      postCode: values.postCode,
      country: values.country,
    }

    try {
      mutate(userDetails)

      if (isSuccess) {
        navigate({ to: '/dashboard' })
      }
    } catch (error) {
      console.error(error)
    }
  }

  const next = async () => {
    const fields = profileFormSteps[currentStep]?.fields

    const output = await trigger(fields as FieldName[], { shouldFocus: true })
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
                fieldName={'lastName'}
                formLabel={'Last Name'}
                placeholder={'Doe'}
              />

              <FormSelect
                control={form.control}
                fieldName={'title'}
                formLabel={'Title'}
                selectPlaceholder={'Title'}
                children={titleSelectOptions.map((title, index) => (
                  <SelectItem key={index} value={title}>
                    {title}
                  </SelectItem>
                ))}
              />

              <FormInput
                control={form.control}
                fieldName={'preferredName'}
                formLabel={'Preferred Name'}
                placeholder={'Optional'}
              />

              <FormInput
                control={form.control}
                fieldName={'dateOfBirth'}
                formLabel={'Date of Birth'}
                placeholder={'DD/MM/YYYY'}
                type={'date'}
              />

              <FormSelect
                control={form.control}
                fieldName={'gender'}
                formLabel={'Gender'}
                selectPlaceholder={'Gender'}
                children={genderSelectOptions.map((gender, index) => (
                  <SelectItem key={index} value={gender}>
                    {gender}
                  </SelectItem>
                ))}
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
                fieldName={'email'}
                formLabel={'Email'}
                type={'email'}
                placeholder={'JohnDoe@email.com'}
              />

              <FormInput
                control={form.control}
                fieldName={'phone'}
                formLabel={'Phone Number'}
                placeholder={'Home or Mobile'}
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
                fieldName={'address'}
                formLabel={'Address'}
                placeholder={'123 Example Street'}
              />

              <FormInput
                control={form.control}
                fieldName={'suburb'}
                formLabel={'Suburb'}
                placeholder={'Richmond'}
              />

              <FormInput
                control={form.control}
                fieldName={'city'}
                formLabel={'City'}
                placeholder={'Christchurch'}
              />

              <FormInput
                control={form.control}
                fieldName={'postCode'}
                formLabel={'Post Code'}
                placeholder={'1234'}
                type={'string'}
              />

              <FormInput
                control={form.control}
                fieldName={'country'}
                formLabel={'Country'}
                placeholder={'New Zealand'}
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
                    <FormLabel>
                      {key
                        // Adds space between camelCase words
                        .replace(/([a-z])([A-Z])/g, '$1 $2')
                        // Capitalize first letter
                        .replace(/^./, (str) => str.toUpperCase())}
                    </FormLabel>
                    <FormControl>
                      <Input
                        value={value as string}
                        readOnly
                        className="block w-full cursor-not-allowed rounded-md border-0 bg-gray-200 py-1.5 text-gray-900 shadow-sm sm:text-sm sm:leading-6"
                      />
                    </FormControl>
                  </FormItem>
                </div>
              ))}
            </MotionContainer>
          )}

          {/* This could be handled better, refactor when time allows */}
          <FormStepButtons
            currentStep={currentStep}
            profileFormStepsLength={profileFormSteps.length}
            prevButtonType={'button'}
            nextButtonType={'button'}
            prevButtonText={'Previous'}
            nextButtonText={'Next'}
            onClickPrev={prev}
            onClickNext={next}
            submitButtonText={isPending ? 'Submitting' : 'Submit'}
            submitButtonType={'submit'}
          />
        </form>
      </Form>
    </section>
  )
}

export default ProfileForm

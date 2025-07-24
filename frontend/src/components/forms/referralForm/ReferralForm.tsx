import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, FormProvider } from 'react-hook-form'
import { z } from 'zod'
import { referralFormSchema } from '@/lib/schemas/referralFormSchema'
import { referralFormSteps } from '@/lib/formOptions/referralFormOptions'
import {
  StepPersonalInfo,
  StepLanguageInfo,
  StepMedicalInfo,
  StepDisabilityInfo,
  StepAdditionalInfo,
  StepReferralContactInfo,
  StepEmergencyContactInfo,
  StepConsentInfo,
} from '@/components/forms/referralForm/referralFormComponents/index'
import useUserProfile from '@/hooks/userProfile/useUserProfile'
import useCreateReferralForm from '@/hooks/userProfile/useCreateReferralForm'
import { useNavigate } from '@tanstack/react-router'
import { referralFormStore } from '@/lib/store/referralFormStore'
import { Store, useStore } from '@tanstack/react-store'

import { useAuth } from '@clerk/clerk-react'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import type {
  UserProfileProps,
  UserInformationProps,
  ContactInformationProps,
  AddressInformationProps,
} from '@/lib/interfaces'

import { useEffect } from 'react'
import { buildReferralDetails } from '@/lib/functions/formFunctions'

const stepComponents = [
  StepPersonalInfo,
  StepLanguageInfo,
  StepMedicalInfo,
  StepDisabilityInfo,
  StepAdditionalInfo,
  StepReferralContactInfo,
  StepEmergencyContactInfo,
  StepConsentInfo,
] as const

const stepStore = new Store({
  stepIndex: 0,
})

type ReferralFormType = z.infer<typeof referralFormSchema>

export const preloadReferralFormData = (
  userData?: UserProfileProps,
): ReferralFormType => {
  const personal = userData?.personalInformation ?? ({} as UserInformationProps)
  const contact =
    userData?.contactInformation ?? ({} as ContactInformationProps)
  const address =
    userData?.addressInformation ?? ({} as AddressInformationProps)
  return {
    firstName: personal.firstName ?? '',
    lastName: personal.lastName ?? '',
    title: personal.title ?? '',
    preferredName: personal.preferredName ?? '',
    gender: personal.gender ?? '',
    dateOfBirth: personal.dateOfBirth
      ? new Date(personal.dateOfBirth).toISOString().split('T')[0]
      : '',

    email: contact.email ?? '',
    phone: contact.phone ?? '',

    address: address.address ?? '',
    suburb: address.suburb ?? '',
    city: address.city ?? '',
    postCode: address.postCode ?? '',
    country: address.country ?? '',

    firstLanguage: '',
    interpreter: '',
    culturalSupport: '',
    communicationNeeds: '',
    doctorName: '',
    doctorPhone: '',
    doctorAddress: '',
    doctorSuburb: '',
    doctorCity: '',
    nationalHealthIndex: '',
    disabilityType: '',
    disabilityDetails: '',
    disabilityReasonForReferral: '',
    disabilitySupportRequired: '',
    safety: '',
    otherImportantInformation: '',
    referrerFirstName: '',
    referrerLastName: '',
    referrerEmail: '',
    referrerPhone: '',
    referrerRelationship: '',
    emergencyContactFirstName: '',
    emergencyContactLastName: '',
    emergencyContactPhone: '',
    emergencyContactEmail: '',
    emergencyContactRelationship: '',
    provideInformation: '',
    shareInformation: '',
    contactedForAdditionalInformation: '',
    statisticalInformation: '',
    correctInformationProvided: '',
  }
}

const ReferralForm = () => {
  const { userId } = useAuth()
  const { isLoading, isError, userData } = useUserProfile(userId as string)
  const navigate = useNavigate()
  const { mutate, isPending } = useCreateReferralForm(userId as string, () => {
    navigate({ to: `/dashboard` })
  })

  if (isLoading) return <div>Loading...</div>
  useEffect(() => {
    if (userData) {
      const mapped = preloadReferralFormData(userData)
      referralFormStore.setState((state) => ({
        ...state,
        referralFormData: mapped,
      }))
    }
  }, [userData])

  const form = useForm<z.infer<typeof referralFormSchema>>({
    resolver: zodResolver(referralFormSchema),
    values: referralFormStore.state.referralFormData,
    mode: 'onBlur',
  })

  const stepIndex = useStore(stepStore, (s) => s.stepIndex)
  const CurrentStep = stepComponents[stepIndex]
  const currentStepFields = referralFormSteps[stepIndex]
    .fields as (keyof z.infer<typeof referralFormSchema>)[]

  const onNext = async () => {
    const valid = await form.trigger(
      currentStepFields as (keyof z.infer<typeof referralFormSchema>)[],
    )
    if (!valid) return
    stepStore.setState((s) => ({ ...s, stepIndex: s.stepIndex + 1 }))
  }

  const onPrev = () => {
    stepStore.setState((s) => ({ ...s, stepIndex: s.stepIndex - 1 }))
  }

  const onSubmit = (values: z.infer<typeof referralFormSchema>) => {
    if (!userId) return

    const referralDetails = buildReferralDetails(
      userId,
      userData?.company?.id,
      values,
    )

    try {
      mutate(referralDetails)
      console.log('Referral form submitted:', referralDetails)
    } catch (error) {
      console.error(error)
    }
  }

  const isFormComplete = referralFormStore.subscribe(() => {
    const data = referralFormStore.state.referralFormData
    return Object.values(data).every((value) => value !== '')
  })

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CurrentStep
            form={form}
            delta={1}
            header={referralFormSteps[stepIndex].name}
            subtitle={referralFormSteps[stepIndex].subtitle}
            communicationNeedsValue={form.watch('communicationNeeds') || ''}
          />
          <div className="flex justify-between mx-4">
            <Button
              type="button"
              onClick={onPrev}
              disabled={stepIndex === 0}
              variant="secondary"
            >
              Back
            </Button>
            {stepIndex === stepComponents.length - 1 ? (
              <Button type="submit" disabled={!isFormComplete || isPending}>
                {isPending ? 'Submitting...' : 'Submit'}
              </Button>
            ) : (
              <Button type="button" onClick={onNext}>
                Next
              </Button>
            )}
          </div>
        </form>
      </Form>
    </FormProvider>
  )
}

export { ReferralForm }

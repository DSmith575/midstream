import type { z } from 'zod'
import type {
  AddressInformationProps,
  ContactInformationProps,
  UserInformationProps,
  UserProfileProps,
} from '@/lib/interfaces'
import type { referralFormSchema } from '@/lib/schemas/referralFormSchema'

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
    firstName: personal.firstName,
    lastName: personal.lastName,
    title: personal.title,
    preferredName: personal.preferredName,
    gender: personal.gender,
    dateOfBirth: personal.dateOfBirth
      ? new Date(personal.dateOfBirth).toISOString().split('T')[0]
      : '',

    email: contact.email,
    phone: contact.phone,

    address: address.address,
    suburb: address.suburb,
    city: address.city,
    postCode: address.postCode,
    country: address.country,

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
    whanauGoal: '',
    aspiration: '',
    biggestBarrier: '',
  }
}

import type {
  AddressInformationProps,
  ContactInformationProps,
  UserInformationProps,
  UserProfileProps,
} from '@/lib/interfaces'
import type { referralFormSchema } from '@/lib/schemas/referralFormSchema'
import type { z } from 'zod'
import { splitAndCapitalize } from '@/lib/functions/functions'

interface FormSection {
  title: string
  field: Record<string, any>
}

export const generateFormSections = (
  referralForm: Record<string, any>,
  options?: {
    includeKeys?: Array<string>
    excludeKeys?: Array<string>
  },
): Array<FormSection> => {
  const { includeKeys, excludeKeys } = options || {}

  return Object.entries(referralForm).flatMap(([topKey, topValue]) => {
    if (excludeKeys?.includes(topKey)) return []

    // Filter by includeKeys if provided
    if (includeKeys && !includeKeys.includes(topKey)) return []

    if (typeof topValue !== 'object' || topValue === null) return []

    // If it's the "user" object, dive deeper
    if (topKey === 'user') {
      return Object.entries(topValue)
        .filter(
          ([_, subValue]) => typeof subValue === 'object' && subValue !== null,
        )
        .map(([subKey, subValue]) => ({
          title: splitAndCapitalize(subKey),
          field: subValue,
        }))
    }

    return [
      {
        title: splitAndCapitalize(topKey),
        field: topValue,
      },
    ]
  })
}

export const preLoadedData = (
  userData?: UserProfileProps,
): z.infer<typeof referralFormSchema> => {
  const personal: Partial<UserInformationProps> =
    userData?.personalInformation ?? {}
  const contact: Partial<ContactInformationProps> =
    userData?.contactInformation ?? {}
  const address: Partial<AddressInformationProps> =
    userData?.addressInformation ?? {}

  return {
    firstName: personal.firstName ?? '',
    lastName: personal.lastName ?? '',
    title: personal.title ?? '',
    preferredName: personal.preferredName ?? '',
    dateOfBirth: personal.dateOfBirth
      ? new Date(personal.dateOfBirth).toISOString().split('T')[0]
      : '',
    gender: personal.gender ?? '',
    email: contact.email ?? '',
    phone: contact.phone ?? '',
    address: address.address ?? '',
    suburb: address.suburb ?? '',
    city: address.city ?? '',
    postCode: address.postCode ? String(address.postCode) : '',
    country: address.country ?? '',

    firstLanguage: '',
    interpreter: '',
    culturalSupport: '',
    communicationNeeds: '',
    communicationNeedsDetails: '',
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

export const buildReferralDetails = (
  userId: string,
  companyId: number | undefined,
  values: z.infer<typeof referralFormSchema>,
) => {
  const {
    firstName,
    lastName,
    title,
    preferredName,
    gender,
    dateOfBirth,
    address,
    suburb,
    city,
    postCode,
    country,
    email,
    phone,
    firstLanguage,
    interpreter,
    culturalSupport,
    communicationNeeds,
    communicationNeedsDetails,
    doctorName,
    doctorPhone,
    doctorAddress,
    doctorSuburb,
    doctorCity,
    nationalHealthIndex,
    disabilityType,
    disabilityDetails,
    disabilityReasonForReferral,
    disabilitySupportRequired,
    hasMobilityIssues,
    safety,
    otherImportantInformation,
    referrerFirstName,
    referrerLastName,
    referrerEmail,
    referrerPhone,
    referrerRelationship,
    emergencyContactFirstName,
    emergencyContactLastName,
    emergencyContactPhone,
    emergencyContactEmail,
    emergencyContactRelationship,
    provideInformation,
    shareInformation,
    contactedForAdditionalInformation,
    statisticalInformation,
    correctInformationProvided,
  } = values

  return {
    googleId: userId,
    userProfile: {
      firstName,
      lastName,
      title,
      preferredName,
      gender,
      dateOfBirth,
    },
    addressInformation: {
      address,
      suburb,
      city,
      postCode,
      country,
    },
    contactInformation: {
      email,
      phone,
    },
    languageInfo: {
      firstLanguage,
      interpreter,
      culturalSupport,
      communicationNeeds,
      communicationNeedsDetails,
    },
    doctorInfo: {
      doctorName,
      doctorPhone,
      doctorAddress,
      doctorSuburb,
      doctorCity,
      nationalHealthIndex,
    },
    disabilityInfo: {
      disabilityType,
      hasMobilityIssues,
      disabilityDetails,
      disabilityReasonForReferral,
      disabilitySupportRequired,
    },
    additionalInfo: {
      safety,
      otherImportantInformation,
    },
    referrerInfo: {
      referrerFirstName,
      referrerLastName,
      referrerEmail,
      referrerPhone,
      referrerRelationship,
    },
    emergencyContactInfo: {
      emergencyContactFirstName,
      emergencyContactLastName,
      emergencyContactPhone,
      emergencyContactEmail,
      emergencyContactRelationship,
    },
    consentInfo: {
      provideInformation,
      shareInformation,
      contactedForAdditionalInformation,
      statisticalInformation,
      correctInformationProvided,
    },
    companyId,
  }
}

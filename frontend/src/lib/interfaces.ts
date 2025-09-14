export interface Steps {
  id: string
  name: string
  subtitle: string
  fields: Array<string>
}

export interface UserInformationProps {
  firstName: string
  lastName: string
  title: string
  preferredName?: string
  gender: string
  dateOfBirth: string
}

export interface AddressInformationProps {
  address: string
  suburb: string
  city: string
  postCode: string
  country: string
}

export interface ContactInformationProps {
  email: string
  phone: string
}

export interface UserProfileProps {
  id?: number
  personalInformation?: UserInformationProps
  addressInformation?: AddressInformationProps
  contactInformation?: ContactInformationProps
  casesCompleted?: number
  casesAssigned?: number
  role?: string
  company?: CompanyProps
  companyId?: number
}

export interface CreateUserProps {
  googleId: string
  firstName: string
  lastName: string
  title: string
  preferredName?: string
  gender: string
  dateOfBirth: string
  email: string
  phone: string
  address: string
  suburb: string
  city: string
  postCode: string
  country: string
}
export interface CreateReferralProps {
  googleId: string
  userProfile: UserInformationProps
  addressInformation: AddressInformationProps
  contactInformation: ContactInformationProps
  languageInfo: ReferralFormLanguageProps
  doctorInfo: ReferralFormDoctorProps
  disabilityInfo: ReferralFormDisabilityProps
  additionalInfo: ReferralFormAdditionalInfoProps
  referrerInfo: ReferralFormReferrerProps
  emergencyContactInfo: ReferralFormEmergencyContactProps
  consentInfo: ReferralConsentProps
}

export interface ReferralFormLanguageProps {
  firstLanguage: string
  interpreter: string
  culturalSupport: string
  communicationNeeds: string
}
export interface ReferralFormDoctorProps {
  doctorName: string
  doctorPhone: string
  doctorAddress: string
  doctorSuburb: string
  doctorCity: string
  nationalHealthIndex: string
}

export interface ReferralFormDisabilityProps {
  disabilityType: string
  disabilityDetails?: string
  disabilityReasonForReferral: string
  disabilitySupportRequired: string
}

export interface ReferralFormAdditionalInfoProps {
  safety: string
  otherImportantInformation: string
}

export interface ReferralFormReferrerProps {
  referrerFirstName: string
  referrerLastName: string
  referrerEmail: string
  referrerPhone: string
  referrerRelationship: string
}

export interface ReferralFormEmergencyContactProps {
  emergencyContactFirstName: string
  emergencyContactLastName: string
  emergencyContactPhone: string
  emergencyContactEmail: string
  emergencyContactRelationship: string
}

export interface ReferralConsentProps {
  provideInformation: string
  shareInformation: string
  contactedForAdditionalInformation: string
  statisticalInformation: string
  correctInformationProvided: string
}

export interface CompanyProps {
  id: number
  name: string
  address: string
  suburb: string
  city: string
  postCode: number
  country: string
  phone: string
  email: string
  website?: string | null
}

export interface JoinCompanyProps {
  companyId: number
  userId: string
}

export interface CreateServicePlanProps {
  serviceCaseId: string
}

export interface CreateServicePlanEntryProps {
  servicePlanId: string,
  serviceCategoryId: string,
  allocatedMinutes: number,
  comment?: string,
  userId?: string,
}
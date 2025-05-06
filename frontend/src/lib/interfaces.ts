export interface Steps {
	id: string;
	name: string;
	subtitle: string;
	fields: string[];
}

export interface UserInformationProps {
	firstName: string;
	lastName: string;
	title: string;
	preferredName?: string;
	gender: string;
	dateOfBirth: string;
}

export interface AddressInformationProps {
	address: string;
	suburb: string;
	city: string;
	postCode: number;
	country: string;
}

export interface ContactInformationProps {
	email: string;
	phone: string;
}

// export interface UserProfileProps {
// 	personalInformation?: UserInformationProps | null;
// 	addressInformation?: AddressInformationProps | null;
// 	contactInformation?: ContactInformationProps | null;
// 	casesCompleted?: number;
// }

export interface UserProfileProps {
	personalInformation?: UserInformationProps ;
	addressInformation?: AddressInformationProps;
	contactInformation?: ContactInformationProps;
	casesCompleted?: number;
	casesAssigned?: number;
}

export interface CreateUserProps {
	googleId: string;
	firstName: string;
	lastName: string;
	title: string;
	preferredName?: string;
	gender: string;
	dateOfBirth: string;
	email: string;
	phone: string;
	address: string;
	suburb: string;
	city: string;
	postCode: number;
	country: string;
}
export interface CreateReferralProps {
	googleId: string;
	userProfile: UserInformationProps;
	addressInformation: AddressInformationProps;
	contactInformation: ContactInformationProps;
	languageInfo: ReferralFormLanguageProps;
	doctorInfo: ReferralFormDoctorProps;
	disabilityInfo: ReferralFormDisabilityProps;
	additionalInfo: ReferralFormAdditionalInfoProps;
	referrerInfo: ReferralFormReferrerProps;
	emergencyContactInfo: ReferralFormEmergencyContactProps;
	consentInfo: ReferralConsentProps;
}

export interface ReferralFormLanguageProps {
	firstLanguage: string;
	interpreter: string;
	culturalSupport: string;
	communicationNeeds: string;
}
export interface ReferralFormDoctorProps {
	doctorName: string;
	doctorPhone: string;
	doctorAddress: string;
	doctorSuburb: string;
	doctorCity: string;
	nationalHealthIndex: string;
}

export interface ReferralFormDisabilityProps {
	disabilityType: string;
	disabilityDetails?: string;
	disabilityReasonForReferral: string;
	disabilitySupportRequired: string;
}

export interface ReferralFormAdditionalInfoProps {
	safety: string;
	otherImportantInformation: string;
}

export interface ReferralFormReferrerProps {
	referrerFirstName: string;
	referrerLastName: string;
	referrerEmail: string;
	referrerPhone: string;
	referrerRelationship: string;
}

export interface ReferralFormEmergencyContactProps {
	emergencyContactFirstName: string;
	emergencyContactLastName: string;
	emergencyContactPhone: string;
	emergencyContactEmail: string;
	emergencyContactRelationship: string;
}

export interface ReferralConsentProps {
	provideInformation: string;
	shareInformation: string;
	contactedForAdditionalInformation: string;
	statisticalInformation: string;
	correctInformationProvided: string;
}


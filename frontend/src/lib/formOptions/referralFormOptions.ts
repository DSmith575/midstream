import type { Steps } from "@/lib/profileInterfaces";

export const referralFormFirstLanguageOptions: string[] = [
	"Arabic",
	"Bengali",
	"Chinese",
	"English",
	"French",
	"German",
	"Hindi",
	"Italian",
	"Japanese",
	"Korean",
	"Portuguese",
	"Russian",
	"Spanish",
	"Turkish",
	"Urdu",
	"Other",
];

export const referralFormDisabilityOptions: string[] = [
	"Blindness",
	"Low Vision",
	"Leprosy Cured Persons",
	"Hearing Impairment (Deaf and Hard of Hearing)",
	"Locomotor Disability",
	"Dwarfism",
	"Intellectual Disability",
	"Mental Illness",
	"Autism Spectrum Disorder",
	"Cerebral Palsy",
	"Muscular Dystrophy",
	"Chronic Neurological Conditions",
	"Specific Learning Disabilities",
	"Multiple Sclerosis",
	"Speech and Language Disability",
	"Thalessemia",
	"Hemophilia",
	"Sickle Cell Disease",
	"Multiple Disabilities (more than one of the above)",
	"Acid Attack Victim",
	"Parkinson's Disease",
	"Other"
]

export const yesOrNo: string[] = ["Yes", "No"];

export const referrerRelationshipOptions: string[] = [
	"Self",
  "Parent",
  "Guardian",
  "Family Member",
  "Friend",
  "Spouse/Partner",
  "Colleague",
  "Healthcare Provider",
  "Social Worker",
  "Case Manager",
  "Teacher",
  "Counselor",
  "Community Worker",
  "Law Enforcement",
  "Other",
];

export const referralFormSteps: Steps[] = [
	{
		id: "Step 1",
		name: "Personal Information",
		subtitle: "",
		fields: [
			"firstName",
			"lastName",
			"title",
			"preferredName",
			"dateOfBirth",
			"gender",
		],
	},
	{
		id: "Step 2",
		name: "Language Information",
		subtitle: "Provide your info type here",
		fields: [
			"firstLanguage",
			"interpreter",
			"culturalSupport",
			"communicationNeeds",
			"communicationNeedsDetails",
		],
	},
	{
		id: "Step 3",
		name: "Medical Information",
		subtitle: "Provide your medical information.",
		fields: ["doctorName", "doctorPhone", "doctorAddress", "doctorSuburb", "doctorCity", "nationalHealthIndex"],
	},
	{
		id: "Step 4",
		name: "Disability Information",
		subtitle: "Subtitle Information",
		fields: ["disabilityType", "disabilityDetails", "disabilityReasonForReferral", "disabilitySupportRequired"],
	},
	{
		id: "Step 5",
		name: "Additional Information",
		subtitle: "Provide your medical information.",
		fields: ["safety", "otherImportantInformation"],
	},
	{
		id: "Step 6",
		name: "Referrer Contact Details",
		subtitle: "",
		fields: ["referrerFirstName", "referrerLastName", "referrerEmail", "referrerPhone", "referrerRelationship"],
	},
	{
		id: "Step 7",
		name: "Emergency Contact Details",
		subtitle: "Subtitle Information",
		fields: ["emergencyContactFirstName", "emergencyContactLastName", "emergencyContactEmail", "emergencyContactPhone", "emergencyContactRelationship"],
	},
	{
		id: "Step 8",
		name: "Consent",
		subtitle: "Subtitle Information",
		fields: ["provideInformation", "shareInformation", "contactedForAdditionalInformation", "statisticalInformation", "correctInformationProvided"],
	},
];

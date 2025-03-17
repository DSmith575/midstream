import { Steps } from "@/interfaces/profileInterfaces";

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

export const referralFormInterpreterOptions: string[] = ["Yes", "No"];

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
		name: "Insert Info type",
		subtitle: "Provide your info type here",
		fields: [
			"firstLanguage",
			"interpreter",
			"culturalSupport",
			"communicationNeeds",
		],
	},
	{
		id: "Step 3",
		name: "Address",
		subtitle: "Provide your address details.",
		fields: ["address", "suburb", "city", "postCode", "country"],
	},
	{
		id: "Step 4",
		name: "Complete",
		subtitle: "Please check that all information is correct.",
		fields: ["complete"],
	},
];

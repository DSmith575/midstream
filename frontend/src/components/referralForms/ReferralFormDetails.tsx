import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const splitAndCapitalize = (label: string) => {
	return label
		.replace(/([a-z])([A-Z])/g, "$1 $2") // Insert space between camelCase words
		.replace(/^./, (match) => match.toUpperCase()); // Capitalize the first letter
};

const ReferralFormDetails = ({ referralForm }: any) => {
	console.log(referralForm);
	return (
		<div className={`flex flex-col overflow-auto`}>
			<div className={`flex flex-col overflow-y-auto p-4`}></div>
      <Label className={"text-md mb-1.5"}>Language Details</Label>
			{Object.entries(referralForm.communication)
				.filter(([key]) => key !== "id")
				.map(([key, value]) => (
					<div key={key} className="mb-4">
						<Label htmlFor={key}>{splitAndCapitalize(key)}</Label>
						<Input
							id={key}
							className="block w-full cursor-default rounded-md border-0 bg-gray-200 py-1.5 text-gray-900 shadow-sm sm:text-sm sm:leading-6"
							readOnly
							value={value as string}
						/>
					</div>
				))}

<Label className={"text-md mb-1.5"}>Medical Details</Label>
			{Object.entries(referralForm.medical)
				.filter(([key]) => key !== "id")
				.map(([key, value]) => (
					<div key={key} className="mb-4">
						<Label className={"text-xs"} htmlFor={key}>{splitAndCapitalize(key)}</Label>
						<Input
							id={key}
							className="block w-full cursor-default rounded-md border-0 bg-gray-200 py-1.5 text-gray-900 shadow-sm sm:text-sm sm:leading-6"
							readOnly
							value={value as string}
						/>
					</div>
				))}

<Label className={"text-md mb-1.5"}>Disability Details</Label>
			{Object.entries(referralForm.disability)
				.filter(([key]) => key !== "id")
				.map(([key, value]) => (
					<div key={key} className="mb-4">
						<Label htmlFor={key}>{splitAndCapitalize(key)}</Label>
						<Input
							id={key}
							className="block w-full cursor-default rounded-md border-0 bg-gray-200 py-1.5 text-gray-900 shadow-sm sm:text-sm sm:leading-6"
							readOnly
							value={value as string}
						/>
					</div>
				))}

<Label className={"text-md mb-1.5"}>Referrer Details</Label>
			{Object.entries(referralForm.referrer)
				.filter(([key]) => key !== "id")
				.map(([key, value]) => (
					<div key={key} className="mb-4">
						<Label htmlFor={key}>{splitAndCapitalize(key)}</Label>
						<Input
							id={key}
							className="block w-full cursor-default rounded-md border-0 bg-gray-200 py-1.5 text-gray-900 shadow-sm sm:text-sm sm:leading-6"
							readOnly
							value={value as string}
						/>
					</div>
				))}

<Label className={"text-md mb-1.5"}>Emergency Contact</Label>
			{Object.entries(referralForm.emergencyContact)
				.filter(([key]) => key !== "id")
				.map(([key, value]) => (
					<div key={key} className="mb-4">
						<Label htmlFor={key}>{splitAndCapitalize(key)}</Label>
						<Input
							id={key}
							className="block w-full cursor-default rounded-md border-0 bg-gray-200 py-1.5 text-gray-900 shadow-sm sm:text-sm sm:leading-6"
							readOnly
							value={value as string}
						/>
					</div>
				))}

<Label className={"text-md mb-1.5"}>Consent</Label>
			{Object.entries(referralForm.consent)
				.filter(([key]) => key !== "id")
				.map(([key, value]) => (
					<div key={key} className="mb-4">
						<Label htmlFor={key}>{splitAndCapitalize(key)}</Label>
						<Input
							id={key}
							className="block w-full cursor-default rounded-md border-0 bg-gray-200 py-1.5 text-gray-900 shadow-sm sm:text-sm sm:leading-6"
							readOnly
							value={value as string}
						/>
					</div>
				))}
		</div>
	);
};

export default ReferralFormDetails;

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { splitAndCapitalize } from "@/utils/functions/functions";

interface ReferralFormFieldsProps {
	refField: String[];
	header: String;
}

const ReferralFormFields = ({ refField, header }: ReferralFormFieldsProps) => {
	return (
		<section className={"flex flex-col overflow-y-auto"}>
			<Label className={"text-md mb-1.5"}>{header}</Label>
			{Object.entries(refField)
				.filter(([key]) => key !== "id")
				.map(([key, value]) => (
					<div key={key} className="mb-4">
						<Label htmlFor={key}>{splitAndCapitalize(key)}</Label>
						<Input
							id={key}
							className="block w-full cursor-default rounded-md border-0 bg-gray-200 py-1.5 text-gray-900 shadow-sm sm:text-sm sm:leading-6"
							readOnly
							value={
								typeof value === "boolean"
									? value
										? "Yes"
										: "No"
									: (value as string)
							}
						/>
					</div>
				))}
		</section>
	);
};

export default ReferralFormFields;

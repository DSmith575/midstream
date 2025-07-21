import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { splitAndCapitalize } from "@/lib/functions/functions";

interface ReferralFormFieldsProps {
	refField: Record<string, any>;
	// header: string;
}

const WorkerReferralFormClientView = ({ refField }: ReferralFormFieldsProps) => {
	return (
		<section className={"grid grid-cols-2 gap-1 overflow-y-auto"}>
						{/* <Label className={"text-md mb-1.5"}>{header}</Label> */}
			{Object.entries(refField)
				.filter(([key]) => key !== "id" && key !== "userId" && key !== "createdAt" && key !== "updatedAt")
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
									: typeof value === "string" && !isNaN(Date.parse(value))
									? new Date(value).toLocaleDateString() 
									: (value as string)
							}
						/>
					</div>
				))}
		</section>
	);
};

export { WorkerReferralFormClientView };

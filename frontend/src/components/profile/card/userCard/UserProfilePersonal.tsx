import type { UserInformationProps } from "@/lib/interfaces";
import TextParagraph from "@/components/text/textParagraph";
import { getUserAge } from "@/lib/functions/functions";

interface PersonalInformationProps {
	personalInfo?: UserInformationProps;
}

const PersonalInformation = ({ personalInfo }: PersonalInformationProps) => {
	if (!personalInfo) return null;

	const { firstName, lastName, preferredName, dateOfBirth } =
		personalInfo;

	return (
		<>
			<h1 className="text-xl -mt-2">
				{firstName} {lastName}, {getUserAge(dateOfBirth)}
			</h1>
			<div className={'flex'}>
			{preferredName && <TextParagraph text={preferredName} />}
			</div>
		</>
	);
};

export default PersonalInformation;

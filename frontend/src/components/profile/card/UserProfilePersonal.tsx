import { UserInformationProps } from "@/interfaces/profileInterfaces";
import TextParagraph from "@/components/text/textParagraph";
import { getUserAge } from "@/utils/functions/functions";

interface PersonalInformationProps {
	personalInfo?: UserInformationProps;
}

const PersonalInformation = ({ personalInfo }: PersonalInformationProps) => {
	if (!personalInfo) return null;

	const { title, firstName, lastName, preferredName, gender, dateOfBirth } =
		personalInfo;

	return (
		<section className={"flex flex-col"}>
			<h1 className="mb-1 text-xl">
				{title} {firstName} {lastName}
			</h1>
			{preferredName && (
				<TextParagraph text={preferredName} span={"Preferred Name"} />
			)}
			<TextParagraph text={gender} span={"Gender"} />
			<TextParagraph text={getUserAge(dateOfBirth)} span={"Age"} />
		</section>
	);
};

export default PersonalInformation;

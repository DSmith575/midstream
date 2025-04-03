import { ContactInformationProps } from "@/interfaces/profileInterfaces";
import TextParagraph from "@/components/text/textParagraph";

interface ContactProps {
	contactInfo?: ContactInformationProps;
}

const ContactInformation = ({ contactInfo }: ContactProps) => {
	if (!contactInfo) return null;

	const { email, phone } = contactInfo;

	return (
		<>
			<h1 className="mt-2 text-xl">Contact Information</h1>
			<TextParagraph text={email} span={"Email"} />
			<TextParagraph text={phone} span={"Phone"} />
		</>
	);
};

export default ContactInformation;

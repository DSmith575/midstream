import type { ContactInformationProps } from "@/lib/interfaces";
import TextParagraph from "@/components/text/TextParagraph";
import { Phone, Mail } from "lucide-react";

interface ContactProps {
	contactInfo?: ContactInformationProps;
}

const ContactInformation = ({ contactInfo }: ContactProps) => {
	if (!contactInfo) return null;

	const { email, phone } = contactInfo;

	return (
		<section className={"flex gap-2"}>
			<TextParagraph text={email} span={<Mail size={20}/>} />
			<TextParagraph text={phone} span={<Phone size={20}/>} />
		</section>
	);
};

export default ContactInformation;
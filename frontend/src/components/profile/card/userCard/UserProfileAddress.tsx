import type { AddressInformationProps } from "@/lib/interfaces";
import TextParagraph from "@/components/text/textParagraph";

interface AddressProps {
  addressInfo?: AddressInformationProps;
}

const AddressInformation = ({ addressInfo }: AddressProps) => {
  if (!addressInfo) return null;

  const { address,  country } = addressInfo;
  // suburb, city, postCode,

  return (
    <>
      <TextParagraph text={`${address}, ${country}`}/>
      </>
  );
};

export default AddressInformation;
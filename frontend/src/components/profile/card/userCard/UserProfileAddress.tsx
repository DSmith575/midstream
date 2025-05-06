import type { AddressInformationProps } from "@/lib/interfaces";
import TextParagraph from "@/components/text/TextParagraph";

interface AddressProps {
  addressInfo?: AddressInformationProps;
}

const AddressInformation = ({ addressInfo }: AddressProps) => {
  if (!addressInfo) return null;

  const { address, suburb, city, postCode, country } = addressInfo;

  return (
    <>
      <TextParagraph text={`${address}, ${country}`}/>
      </>
  );
};

export default AddressInformation;
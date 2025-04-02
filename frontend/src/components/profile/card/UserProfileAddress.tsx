import { AddressInformationProps } from "@/interfaces/profileInterfaces";
import TextParagraph from "@/components/text/textParagraph";

interface AddressProps {
  addressInfo?: AddressInformationProps;
}

const AddressInformation = ({ addressInfo }: AddressProps) => {
  if (!addressInfo) return null;

  const { address, suburb, city, postCode, country } = addressInfo;

  return (
    <>
      <h1 className="mt-2 text-xl">Address</h1>
      <TextParagraph text={address}/>
      <TextParagraph text={`${suburb}, ${city}, ${postCode}, ${country}`}/>
    </>
  );
};

export default AddressInformation;
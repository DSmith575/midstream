import ReferralFormFields from "./ReferralFormFields";

const ReferralFormDetails = ({ referralForm }: any) => {
	console.log(referralForm.personal);
	return (
		<section className={`flex flex-col overflow-auto`}>
		<ReferralFormFields refField={referralForm.communication} header={"Language Details"} />
		<ReferralFormFields refField={referralForm.medical} header={"Medical Details"} />
		<ReferralFormFields refField={referralForm.disability} header={"Disability Details"} />
		<ReferralFormFields refField={referralForm.referrer} header={"Referrer Details"} />
		<ReferralFormFields refField={referralForm.emergencyContact} header={"Emergency Contact"} />
		<ReferralFormFields refField={referralForm.consent} header={"Consent"} />
		</section>
	);
};

export default ReferralFormDetails;

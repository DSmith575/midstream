import { UserProfileProps } from "@/interfaces/profileInterfaces";
import PersonalInformation from "@/components/profile/card/UserProfilePersonal";
import AddressInformation from "@/components/profile/card/UserProfileAddress";
import ContactInformation from "@/components/profile/card/UserProfileContact";

interface CardProps {
	userProfile?: UserProfileProps;
}

const UserProfileCard = ({ userProfile }: CardProps) => {
	if (
		!userProfile?.personalInformation ||
		!userProfile?.addressInformation ||
		!userProfile?.contactInformation
	) {
		return null;
	}
	const { personalInformation, addressInformation, contactInformation } =
		userProfile;

	return (
		<section className={"flex items-start justify-between"}>
			<section className={"flex flex-col items-start justify-between"}>
				<PersonalInformation personalInfo={personalInformation} />
				<AddressInformation addressInfo={addressInformation} />
				<ContactInformation contactInfo={contactInformation} />
			</section>
			{/* Update Button */}
			<button className="rounded-lg bg-green-500 px-8 py-2 text-white shadow">
				Edit (Disabled)
			</button>
		</section>
	);
};

export default UserProfileCard;

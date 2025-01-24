import { Button } from "@/components/ui/button";
import { useAuth, useUser } from "@clerk/clerk-react";
import ProfileForm from "@/components/forms/profileForm/ProfileForm";
import ChatButton from "@/components/chat/ChatButton";
import useUserProfile from "@/hooks/userProfile/useUserProfile";
import Spinner from "@/components/spinner/Spinner";
import { UserInformationProps } from "@/interfaces/profileInterfaces";
import ProfileSetup from "@/components/profileSetup/ProfileSetup";
import useProfileStart from "@/hooks/profileForm/useProfileStart";

const Dashboard = () => {
	const user = useUser();
	const { isLoaded, userId, isSignedIn } = useAuth();
	const { data, isPending, isError, error } = useUserProfile(userId || "");
	const { profileStart, handleProfileStart } = useProfileStart();

	if (!isLoaded || !userId) {
		return null;
	}

	const { firstName, lastName } = user.user as UserInformationProps;

	return (
		<section>
			{isPending && (
				<div className="mt-12 flex items-center justify-center">
					<Spinner />
				</div>
			)}

			{!isPending && data !== null ? (
				<section className="mx-8 mt-2 flex h-[50vh] flex-col items-center justify-center text-center">
					{data.personalInformation.map(
						(item: UserInformationProps, index: number) => (
							<div key={index}>
								<p>
									{item.firstName} {item.lastName}
								</p>
							</div>
						),
					)}
					<ChatButton />
				</section>
			) : (
				!isPending && (
					<>
						{profileStart ? (
							<>
								<section className="mr-10 mt-2 grid justify-end">
									<Button
										variant="outline"
										size="lg"
										className="ml-2"
										onClick={() => handleProfileStart(false)}>
										Back
									</Button>
									<p className="ml-2 text-sm text-muted-foreground">
										Progress will not be saved.
									</p>
								</section>
								<ProfileForm />
							</>
						) : (
							<ProfileSetup
								firstName={firstName}
								lastName={lastName}
								onClick={() =>handleProfileStart(true)}
							/>
						)}
					</>
				)
			)}
		</section>
	);
};

export default Dashboard;

// <section className="mx-8 mt-2 flex h-[50vh] flex-col items-center justify-center text-center">
// 	<h1 className="text-xl">
// 		Hello {firstName} {lastName}!
// 	</h1>
// 	<p>Get your profile setup to get started.</p>
// 	<section className="mr-2 flex gap-2">
// 		<Button
// 			variant="outline"
// 			size="lg"
// 			className=""
// 			onClick={() => setProfileStart(true)}>
// 			Profile Setup
// 		</Button>
// 	</section>
// </section>

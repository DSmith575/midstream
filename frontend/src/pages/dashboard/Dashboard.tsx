import { useEffect, useState } from "react";
import {
	Sheet,
	SheetTrigger,
	SheetContent,
	SheetDescription,
} from "@/components/ui/sheet";
import { DialogTitle } from "@radix-ui/react-dialog";

import { Button } from "@/components/ui/button";
import Chat from "../../components/chat/Chat";
import { useAuth, useUser } from "@clerk/clerk-react";
import ProfileForm from "@/components/forms/profileForm/ProfileForm";

interface UserProps {
	firstName: string;
	lastName: string;
}

const Dashboard = () => {
	const { isLoaded, userId } = useAuth();
	const [profileStart, setProfileStart] = useState<boolean>(false);
	const [userProfile, setUserProfile] = useState([]);
	const user = useUser();
	console.log(user);

	const userGoogleId = user.user?.id;

	useEffect(() => {
		console.log("test");
		if (!userProfile) {
			getUserData();
		}
	}, []);

	const getUserData = async () => {
		const response = await fetch(
			`http://localhost:3000/api/v1/userProfiles/getUserProfile?googleId=${userGoogleId}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			},
		);

		const data = await response.json();
		if (data) {
			setUserProfile(data);
		}
	};

	if (!isLoaded || !userId) {
		return null;
	}

	const { firstName, lastName } = user.user as UserProps;

	return (
		<div>
			{userProfile ? (
				<section className="mx-8 mt-2 flex h-[50vh] flex-col items-center justify-center text-center">
					<h1 className="text-xl">
						Hello {firstName} {lastName}!
					</h1>
					<Sheet>
						<SheetContent side="bottom">
							<DialogTitle className="sr-only">Menu</DialogTitle>
							<SheetDescription className="sr-only">
								Navigation menu
							</SheetDescription>
							<Chat />
						</SheetContent>
						<nav>
							<SheetTrigger asChild>
								<Button variant="outline" size="lg" className="">
									Chat with an AI
								</Button>
							</SheetTrigger>
						</nav>
					</Sheet>
				</section>
			) : (
				<>
					{profileStart ? (
						<>
							<section className="mr-10 mt-2 grid justify-end">
								<Button
									variant="outline"
									size="lg"
									className="ml-2"
									onClick={() => setProfileStart(false)}>
									Back
								</Button>
								<p className="ml-2 text-sm text-muted-foreground">
									Progress will not be saved.
								</p>
							</section>
							<ProfileForm />
						</>
					) : (
						<>
							<section className="mx-8 mt-2 flex h-[50vh] flex-col items-center justify-center text-center">
								<h1 className="text-xl">
									Hello {firstName} {lastName}!
								</h1>
								<p>Get your profile setup to get started.</p>
								<section className="mr-2 flex gap-2">
									<Button
										variant="outline"
										size="lg"
										className=""
										onClick={() => setProfileStart(true)}>
										Profile Setup
									</Button>
								</section>
							</section>
						</>
					)}
				</>
			)}
		</div>
	);
};

export default Dashboard;

import { useState } from "react";
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
import ReferralForm from "@/components/forms/ReferralForm";

interface UserProps {
	firstName: string;
	lastName: string;
}

const Dashboard = () => {
	const { isLoaded, userId } = useAuth();
	const [referralFormStart, setReferralFormStart] = useState<boolean>(false);
	const user = useUser();

	if (!isLoaded || !userId) {
		return null;
	}

	const { firstName, lastName } = user.user as UserProps;

	return (
		<div>
			{referralFormStart ? (
				<>
					<section className={"mr-10 mt-2 grid justify-end"}>
						<Button
							variant="outline"
							size="lg"
							className={"ml-2"}
							onClick={() => setReferralFormStart(false)}>
							Back
						</Button>
						<p className="ml-2 text-sm text-muted-foreground">
							Progress will not be saved.
						</p>
					</section>
					<ReferralForm />
				</>
			) : (
				<>
					<section className={"mt-2 flex justify-between"}>
						<p>
							Welcome Back! {firstName} {lastName}
						</p>
						<section className={"mr-2 flex gap-2"}>
							<Button
								variant="outline"
								size="lg"
								className={""}
								onClick={() => setReferralFormStart(true)}>
								Referral Form
							</Button>
							<Sheet>
								<SheetContent side="bottom">
									<DialogTitle className="sr-only">Menu</DialogTitle>
									<SheetDescription className="sr-only">
										Navigation menu
									</SheetDescription>
									<Chat />
								</SheetContent>
								<nav className="">
									<SheetTrigger asChild>
										<Button variant="outline" size="lg" className="">
											Chat with an AI
										</Button>
									</SheetTrigger>
								</nav>
							</Sheet>
						</section>
					</section>
				</>
			)}
		</div>
	);
};

export default Dashboard;

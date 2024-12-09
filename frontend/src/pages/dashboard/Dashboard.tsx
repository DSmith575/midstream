import {
	Sheet,
	SheetTrigger,
	SheetContent,
	SheetDescription,
} from '@/components/ui/sheet';
import { DialogTitle } from '@radix-ui/react-dialog';

import { Button } from '@/components/ui/button';
import Chat from '../../components/chat/Chat';
import { useAuth, SignedIn, UserButton, useUser } from '@clerk/clerk-react';

interface UserProps {
	firstName: string;
	lastName: string;
}

const Dashboard = () => {
	const { isLoaded, userId } = useAuth();
	const user = useUser();

	if (!isLoaded || !userId) {
		return null;
	}

	const { firstName, lastName } = user.user as UserProps;

	return (
		<div>
			<div>
				Welcome Back! {firstName} {lastName}
			</div>
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
		</div>
	);
};

export default Dashboard;

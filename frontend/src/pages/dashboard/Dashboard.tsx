import { useParams } from 'react-router';
import {
	Sheet,
	SheetTrigger,
	SheetContent,
	SheetDescription,
} from '@/components/ui/sheet';

import { Button } from '@/components/ui/button';
import Chat from '../../components/chat/Chat';

const Dashboard = () => {
	const { userId } = useParams<{ userId: string }>();
	return (
		<div>
			<p>hello {userId}</p>
			<Sheet>
				<SheetContent side="bottom">
					<SheetDescription className="sr-only">Chat Menu</SheetDescription>
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

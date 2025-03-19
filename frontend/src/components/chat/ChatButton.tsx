import {
	Sheet,
	SheetTrigger,
	SheetContent,
	SheetDescription,
} from "@/components/ui/sheet";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import Chat from "./Chat";

const ChatButton = () => {
	return (
		<Sheet>
			<SheetContent side="bottom">
				<DialogTitle className="sr-only">Menu</DialogTitle>
				<SheetDescription className="sr-only">Navigation menu</SheetDescription>
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
	);
};

export default ChatButton;

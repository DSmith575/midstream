import {
	Sheet,
	SheetTrigger,
	SheetContent,
	SheetDescription,
} from "@/components/ui/sheet";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import ReferralFormDetails from "./ReferralFormDetails";

const ReferralFormButton = ({ referralForm }: any) => {
	return (
		<Sheet>
			<SheetContent side={"right"} className="max-h-screen overflow-y-scroll">
				<DialogTitle className="sr-only">ReferralForm</DialogTitle>
				<SheetDescription className="sr-only">Referral Form</SheetDescription>
				<ReferralFormDetails referralForm={referralForm} />
			</SheetContent>
			<nav>
				<SheetTrigger asChild>
					<Button variant="outline" size="lg" className="">
						{new Date(referralForm.createdAt).toLocaleString()}
					</Button>
				</SheetTrigger>
			</nav>
		</Sheet>
	);
};

export default ReferralFormButton;
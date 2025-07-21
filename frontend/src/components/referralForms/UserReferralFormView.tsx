import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTrigger,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import {
// 	Accordion,
// 	AccordionItem,
// 	AccordionTrigger,
// 	AccordionContent,
// } from "@/components/ui/accordion";
// import ReferralFormFields from "@/components/referralForms/ReferralFormFields";

const UserReferralFormView = ({ referralForm }: any) => {
	return (
		<Dialog>
			<Button variant="outline" size="lg" className="" asChild>
				<DialogTrigger>
					{new Date(referralForm.createdAt).toLocaleDateString()}
				</DialogTrigger>
			</Button>
			<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
				<DialogHeader>
					<DialogTitle>
						{referralForm.user.personalInformation.firstName}{" "}
						{referralForm.user.personalInformation.lastName}
					</DialogTitle>
					<DialogDescription>
						{/* <Accordion type="single" collapsible className="w-full">
							{formSections.map((section, index) => (
								<AccordionItem key={index} value={`item-${index}`}>
									<AccordionTrigger>{section.title}</AccordionTrigger>
									<AccordionContent>
										<ReferralFormFields
											refField={section.field}
											header={section.header}
										/>
									</AccordionContent>
								</AccordionItem>
							))}
						</Accordion> */}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button
						variant="outline"
						size="lg"
						className="mt-4 items-center justify-center">
						Download PDF
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export { UserReferralFormView };

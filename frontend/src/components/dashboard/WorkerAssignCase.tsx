import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import {
	Accordion,
	AccordionItem,
	AccordionTrigger,
	AccordionContent,
} from "@/components/ui/accordion";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {WorkerReferralFormClientView} from "@/components/referralForms/WorkerReferralFormClientView";
import { generateFormSections } from "@/lib/functions/formFunctions";

interface AssignWorkerProps {
	refId: string;
	caseWorkerId: string;
}

const apiKey = import.meta.env.VITE_API_BACKEND_URL;

const WorkerAssignCase = ({
	caseWorkerId,
	referralForm,
	setOpen,
	open,
}: any) => {
	const formSections = generateFormSections(referralForm, {
		excludeKeys: ["assignedToWorker"],
	});

	const handleAssignWorker = async ({
		refId,
		caseWorkerId,
	}: AssignWorkerProps) => {
		try {
			const response = await fetch(`${apiKey}assignCases/assignWorker`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					referralId: refId,
					caseWorkerId: caseWorkerId,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to assign worker");
			}
			return alert("Worker assigned successfully!");
		} catch (error) {
			console.error("Error assigning worker:", error);
		}
	};

	return (
		<>
			<Dialog open={open} onOpenChange={() => setOpen(false)}>
				{" "}
				{/* Close dialog on change */}
				<DialogContent className="overflow-y-auto sm:max-w-[425px] lg:max-h-[90vh] lg:max-w-[800px]">
					<DialogHeader>
						<DialogTitle>
							{referralForm.user.personalInformation.firstName}{" "}
							{referralForm.user.personalInformation.lastName}
						</DialogTitle>
					</DialogHeader>
					<DialogDescription>
						test
					</DialogDescription>

					<Accordion type="single" collapsible className="w-full">
						{formSections.map((section, index) => (
							<AccordionItem key={index} value={`item-${index}`}>
								<AccordionTrigger>{section.title}</AccordionTrigger>
								<AccordionContent>
									<WorkerReferralFormClientView refField={section.field} />
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
					<div className={"grid"}>
						<div className={"flex items-center gap-2"}>
							<Label htmlFor="submitStatus" className={"text-right"}>
								Status:
							</Label>
							<Badge
								id="submitStatus"
								className={`block cursor-default text-black ${
									referralForm.status === "SUBMITTED"
										? "bg-green-100"
										: referralForm.status === "PENDING"
											? "bg-yellow-100"
											: referralForm.status === "REJECTED"
												? "bg-red-100"
												: referralForm.status === "APPROVED"
													? "bg-blue-100"
													: referralForm.status === "COMPLETED"
														? "bg-purple-100"
														: referralForm.status === "CANCELLED"
															? "bg-gray-100"
															: referralForm.status === "ASSIGNED"
																? "bg-orange-100"
																: ""
								}`}>
								{referralForm.status}
							</Badge>
						</div>
					</div>
					<div>
						{referralForm.assignedToWorker ? (
							<p className="text-sm text-muted-foreground">
								Assigned to:{" "}
								{referralForm.assignedToWorker.personalInformation.firstName}{" "}
								{referralForm.assignedToWorker.personalInformation.lastName}
							</p>
						) : (
							<p className="text-sm text-muted-foreground">
								No worker assigned
							</p>
						)}
					</div>

					<DialogFooter>
						<Button
							variant="outline"
							size="lg"
							className="rounded bg-green-500 px-4 py-2 font-bold text-black hover:bg-green-600"
							onClick={() =>
								handleAssignWorker({
									refId: referralForm.id,
									caseWorkerId: caseWorkerId,
								})
							}>
							Assign Self
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};

export { WorkerAssignCase };
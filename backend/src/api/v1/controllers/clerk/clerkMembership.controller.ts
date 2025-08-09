// import { Request, Response } from "express";
// import { clerkClient } from "@clerk/express";
// import { orgRoles } from "@/constants";

// // Not currently using

// const createMembershipInvite = async (
// 	req: Request,
// 	res: Response
// ): Promise<any> => {
// 	try {
// 		const { userId } = req.body;
// 		// console.log(orgId)
// 		const orgId = process.env.CLERK_ORG_ID;

// 		if (!orgId || !userId) {
// 			return res.status(400).json({ error: "Missing required fields" });
// 		}

// 		// Create the organization membership
// 		const membership =
// 			await clerkClient.organizations.createOrganizationMembership({
// 				organizationId: orgId, // Use the correct variable name
// 				userId,
// 				role: orgRoles.organizationMember, // Specify the role for the user
// 			});

// 		// Return the membership object in the response
// 		return res.status(201).json(membership);
// 	} catch (error: unknown) {
// 		// Check if error is an instance of Error
// 		if (error instanceof Error) {
// 			console.error("Error creating membership invite:", error.message);
// 		} else {
// 			console.error("Error creating membership invite:", error);
// 		}

// 		// Return a 500 status with a generic error message
// 		return res.status(500).json({ error: "Internal server error" });
// 	}
// };

// export { createMembershipInvite };

import { z } from "zod";

export const referralFormSchema = z.object({
	firstName: z.string().nonempty({ message: "First name is required" }),
	lastName: z.string().nonempty({ message: "Last name is required" }),
	title: z.string().nonempty({message: "Please enter a title"}),
	preferredName: z.string().optional(),
	dateOfBirth: z.string(),
	gender: z.string().nonempty(),
	email: z.string().email(),
	phone: z.string().min(1, "Please enter a valid phone number"),
	address: z.string().nonempty(),
	town: z.string().nonempty(),
	postCode: z.string().nonempty(),
	country: z.string().nonempty(),
});
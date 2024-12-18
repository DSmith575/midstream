import { z } from "zod";

export const profileFormSchema = z.object({
	firstName: z.string({ message: "First name is required" }).nonempty(),
	lastName: z.string({ message: "Last name is required" }).nonempty(),
	title: z.string({message: "Please select a title"}).nonempty(),
	preferredName: z.string().optional(),
	dateOfBirth: z.string({message: "Please enter a valid date of birth"}).nonempty(),
	gender: z.string({ message: "Please select from the options above"}).nonempty(),
	email: z.string({ message: "Please enter a valid email" }).email(),
	phone: z.string({message:"Please enter a valid phone number"}).nonempty(),
	address: z.string({message: "Please enter a valid address"}).nonempty(),
	suburb: z.string({message: "Please enter a valid suburb"}).nonempty(),
	city: z.string({message: "Please enter a valid city"}).nonempty(),
	postCode: z.coerce.number({ message: "Postcode must be at least 4 digits"}).min(1000)
  .max(9999, "Postcode must be at most 4 digits")
  .int("Postcode must be a number"),
	country: z.string().nonempty(),
});
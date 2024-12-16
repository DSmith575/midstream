import { z } from "zod";

export const referralFormSchema = z.object({
	firstName: z.string().nonempty({ message: "Memes" }),
	lastName: z.string().nonempty(),
	email: z.string().email(),
	phone: z.string().min(1, "Please enter a valid phone number"),
	referral: z.string().nonempty(),
	street: z.string().nonempty(),
	city: z.string().nonempty(),
	country: z.string().nonempty(),
	zip: z.string().min(4),
});

import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const createUserProfile = async (req: Request, res: Response): Promise<any> => {
	try {
		if (!req.body || req.body.length === 0) {
			return res.status(400).send({ message: "Content cannot be empty!" });
		}

		const { googleId } = req.body;

		const userExists = await prisma.user.findUnique({
			where: {
				googleId: String(googleId),
			},
		});

		if (userExists) {
			return res.status(400).json({ message: "User already exists" });
		}

		const { firstName, lastName, title, preferredName, dateOfBirth, gender } =
			req.body;
		const { email, phone } = req.body;
		const { address, suburb, city, postCode, country } = req.body;

		const newUser = await prisma.user.create({
			data: {
				googleId: googleId,
			},
		});

		const getNewUser = await prisma.user.findUnique({
			where: {
				googleId: String(newUser.googleId),
			},
		});

		if (!getNewUser) {
			return res.status(400).json({ message: "User not created" });
		}

		// ISO-8601 format
		const date = new Date(dateOfBirth);

		const newProfile = await prisma.personalInformation.create({
			data: {
				userId: getNewUser.id,
				firstName: firstName,
				lastName: lastName,
				title: title,
				gender: gender,
				preferredName: preferredName,
				dateOfBirth: date,
			},
		});

		const checkUserProfile = await prisma.personalInformation.findUnique({
			where: {
				id: String(newProfile.id),
			},
		});

		if (!checkUserProfile) {
			return res.status(400).json({ message: "Profile not created" });
		}

		const newContact = await prisma.contactInformation.create({
			data: {
				userId: getNewUser.id,
				email: email,
				phone: phone,
			},
		});

		const checkContact = await prisma.contactInformation.findUnique({
			where: {
				id: String(newContact.id),
			},
		});

		if (!checkContact) {
			return res.status(400).json({ message: "Contact not created" });
		}

		const newAddress = await prisma.addressInformation.create({
			data: {
				userId: getNewUser.id,
				address: address,
				suburb: suburb,
				city: city,
				postCode: postCode,
				country: country,
			},
		});

		const checkAddress = await prisma.addressInformation.findUnique({
			where: {
				id: String(newAddress.id),
			},
		});

		if (!checkAddress) {
			return res.status(400).json({ message: "Address not created" });
		}

		return res
			.status(201)
			.json({ message: "User profile created successfully" });
	} catch (error: unknown) {
		if (error instanceof Error) {
			return res.status(500).json({ message: error.message });
		}

		return res.status(500).json({ message: "Something went wrong" });
	}
};

const getUserProfile = async (req: Request, res: Response): Promise<any> => {
	try {
		const { googleId } = req.query;

		const user = await prisma.user.findUnique({
			where: {
				googleId: String(googleId),
			},
			include: {
				personalInformation: true,
				contactInformation: true,
				addressInformation: true,
				company: true,
			},
		});

		console.log("User Profile:", user);

		// const genderCounts = await prisma.personalInformation.groupBy({
		// 	by: ["gender"],
		// 	_count: {
		// 		gender: true,
		// 	}});

		// const x = await prisma.personalInformation.count({
		// 	where: {
		// 		gender: "Male"
		// 	}
		// });

		if (!user) {
			return res.status(400).json({ message: "User not found" });
		}

		return res.status(200).json({ user });
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			message: "Something went wrong",
		});
	}
};

export { createUserProfile, getUserProfile };

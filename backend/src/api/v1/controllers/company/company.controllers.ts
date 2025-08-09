import { PrismaClient, Company } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

type CompanyWithoutTimestamps = Omit<Company, "createdAt" | "updatedAt">;

const createCompany = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!req.body || Object.keys(req.body).length === 0) {
			res.status(400).send({ message: "Content cannot be empty!" });
			return;
		}

		const {
			companyName,
			city,
			address,
			suburb,
			postCode,
			country,
			phone,
			email,
			website,
		} = req.body;

		const checkCompanyName = await prisma.company.findFirst({
			where: { name: companyName, address: address },
		});

		if (checkCompanyName) {
			res
				.status(400)
				.json({ message: "Company with this name and address already exists" });
			return;
		}

		const result = await prisma.company.create({
			data: {
				name: companyName,
				address: address,
				suburb: suburb,
				city: city,
				postCode: postCode,
				country: country,
				phone: phone,
				email: email,
				website: website ?? null,
			},
		});

		res.status(200).json(result);
		return;
	} catch (error) {
		res.status(500).json({
			statusCode: res.statusCode,
			message: error instanceof Error ? error.message : "Unknown error",
		});
		return;
	}
};

const getCompanyList = async (req: Request, res: Response): Promise<void> => {
	try {
		const companies: CompanyWithoutTimestamps[] = await prisma.company.findMany(
			{
				select: {
					id: true,
					name: true,
					address: true,
					suburb: true,
					city: true,
					postCode: true,
					country: true,
					phone: true,
					email: true,
					website: true,
				},
			}
		);

		res.status(200).json(companies);
		return;
	} catch (error) {
		res.status(500).json({
			statusCode: res.statusCode,
			message: error instanceof Error ? error.message : "Unknown error",
		});
		return;
	}
};

const joinCompany = async (req: Request, res: Response): Promise<void> => {
	try {
		const companyId = String(req.body.companyId);
		const userId = String(req.body.userId);

		if (!companyId || !userId) {
			res.status(400).json({ message: "Company ID and User ID are required" });
			return;
		}

		// verify user exists first
		const userExists = await prisma.user.findUnique({
			where: {
				googleId: userId,
			},
		});

		if (!userExists) {
			res.status(404).json({ message: "User not found" });
			return;
		}

		if (userExists.companyId !== null) {
			res.status(400).json({
				message: "User is already part of a company",
			});
			return;
		}

		// Optional: verify company exists first
		const company = await prisma.company.findUnique({
			where: { id: companyId },
		});
		if (!company) {
			res.status(404).json({ message: "Company not found" });
			return;
		}

		// check if user is already a company

		const user = await prisma.user.update({
			where: { id: userExists.id },
			data: {
				companyId: companyId,
			},
		});

		if (!user) {
			res.status(404).json({ message: "User not found" });
			return;
		}

		res.status(200).json({
			statusCode: 200,
			message: "User added to company successfully",
			user,
		});
	} catch (error) {
		res.status(500).json({
			statusCode: 500,
			message: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

export { createCompany, getCompanyList, joinCompany };

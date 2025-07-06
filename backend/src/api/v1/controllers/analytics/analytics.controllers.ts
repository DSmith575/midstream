import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import dayjs from "dayjs";

const prisma = new PrismaClient();

const getAnalytics = async (req: Request, res: Response): Promise<any> => {
	try {
		const analytics = await prisma.user.findMany({
			include: {
				personalInformation: true,
				addressInformation: true,
				contactInformation: true,
			},
		});
		const chartData: any = {
			ageGroups: {},
			genderDistribution: {},
			cityDistribution: {},
		};

		analytics.forEach((user) => {
			const personalInfo = user.personalInformation;
			const addressInfo = user.addressInformation;

			const age = personalInfo?.dateOfBirth
				? dayjs().diff(dayjs(personalInfo.dateOfBirth), "year")
				: null;

			// Update later
			if (age !== null) {
				const ageRange =
					age < 18
						? "Under 18"
						: age <= 25
						? "18-25"
						: age <= 35
						? "26-35"
						: age <= 50
						? "36-50"
						: "51+";
				chartData.ageGroups[ageRange] =
					(chartData.ageGroups[ageRange] || 0) + 1;
			}

			// Group by gender
			const gender = personalInfo?.gender || "Unknown";
			chartData.genderDistribution[gender] =
				(chartData.genderDistribution[gender] || 0) + 1;

			// Group by city
			const city = addressInfo?.city || "Unknown";
			chartData.cityDistribution[city] =
				(chartData.cityDistribution[city] || 0) + 1;
		});

		// Send the aggregated chart data
		return res.status(200).json(chartData);
	} catch (error: unknown) {
		if (error instanceof Error) {
			return res.status(500).json({ message: error.message });
		}
		return res.status(500).json({ message: "Something went wrong" });
	}
};

export { getAnalytics };

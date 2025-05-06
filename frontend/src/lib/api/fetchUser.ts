import type { UserProfileProps } from "@/lib/interfaces";

const apiKey = import.meta.env.VITE_API_BACKEND_URL;

const fetchUserProfile = async (userId: string): Promise<UserProfileProps | null> => {
	try {
		const response = await fetch(
			`${apiKey}userProfiles/getUserProfile?googleId=${userId}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			},
		);

		if (!response.ok) {
			throw new Error("Failed to fetch user profile");
		}

		const data = await response.json();

		console.log(data);

		return data.user;
	} catch (error) {
		console.log(error);
		return null;
	}
};

export default fetchUserProfile;

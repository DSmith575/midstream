const apiKey = import.meta.env.VITE_API_BACKEND_URL;

const fetchUserProfile = async (userId: string) => {
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
		return data.user;
	} catch (error) {
		console.error(error);
		return null;
	}
};

export default fetchUserProfile;

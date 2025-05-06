import type { CreateUserProps } from "@/lib/profileInterfaces";

const apiKey = import.meta.env.VITE_API_BACKEND_URL;

const postUserProfile = async (userData: CreateUserProps) => {
	try {
		const response = await fetch(`${apiKey}userProfiles/createUserProfile`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(userData),
		});

    console.log("Response from API:", response);

		if (!response.ok) {
			throw new Error("Failed to create user profile");
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error(error);
	}
};

export default postUserProfile;

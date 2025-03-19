const apiKey = import.meta.env.VITE_API_BACKEND_URL;

const fetchUserReferralForm = async (userId: string) => {
	try {
		const response = await fetch(
			`${apiKey}referralForms/user/getReferralForm/${encodeURIComponent(userId)}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			},
		);

		if (!response.ok) {
			throw new Error("Failed to fetch referral form");
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error(error);
		return null;
	}
};

export default fetchUserReferralForm;

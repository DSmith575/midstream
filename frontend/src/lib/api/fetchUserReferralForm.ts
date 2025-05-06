const apiKey = import.meta.env.VITE_API_BACKEND_URL;

const fetchUserReferralForm = async (googleId: string) => {
	try {
		const response = await fetch(
			`${apiKey}referralForms/user/getReferralForm/${encodeURIComponent(googleId)}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			},
		);

		const data = await response.json();
		return data;
	} catch (error) {
		console.error(error);
		return null;
	}
};

export default fetchUserReferralForm;

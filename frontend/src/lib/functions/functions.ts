export const splitAndCapitalize = (label: string) => {
	return label
		.replace(/([a-z])([A-Z])/g, "$1 $2")
		.replace(/^./, (match) => match.toUpperCase());
};

export const getUserAge = (dateOfBirth: string) => {
	const userAge = new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
	return userAge.toString();
};


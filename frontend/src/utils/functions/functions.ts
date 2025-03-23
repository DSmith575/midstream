export const splitAndCapitalize = (label: string) => {
	return label
		.replace(/([a-z])([A-Z])/g, "$1 $2")
		.replace(/^./, (match) => match.toUpperCase());
};
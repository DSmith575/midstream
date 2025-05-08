import { CreditCard, CalendarRange, User, FileUser  } from "lucide-react";

export const splitAndCapitalize = (label: string) => {
	return label
		.replace(/([a-z])([A-Z])/g, "$1 $2")
		.replace(/^./, (match) => match.toUpperCase());
};

export const getUserAge = (dateOfBirth: string) => {
	const userAge = new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
	return userAge.toString();
};

// This function formats a string to PascalCase by replacing camelCase with spaces
export const formatPascalCase = (input: string): string => {
	return input.replace(/([a-z])([A-Z])/g, '$1 $2');
}

export const getIconForKey = (key: string): React.ComponentType => {
  const iconMap: Record<string, React.ComponentType> = {
    Account: User,
    Applications: FileUser,
    Bills: CreditCard,
    Schedule: CalendarRange,
    // Add other keys and icons as needed
  };

  return iconMap[key] || User;
};
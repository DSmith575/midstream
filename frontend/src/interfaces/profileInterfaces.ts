export interface Steps {
	id: string;
	name: string;
	subtitle: string;
	fields: string[];
}

export interface UserInformationProps {
	firstName: string;
	lastName: string;
	title: string;
	preferredName?: string;
	gender: string;
	dateOfBirth: string;
}

export interface AddressInformationProps {
	address: string;
	suburb: string;
	city: string;
	postCode: number;
	country: string;
}

export interface ContactInformationProps {
	email: string;
	phone: string;
}

export interface UserProfileProps {
	personalInformation?: UserInformationProps | null;
	addressInformation?: AddressInformationProps | null;
	contactInformation?: ContactInformationProps | null;
}

export interface CreateUserProps {
	googleId: string;
	firstName: string;
	lastName: string;
	title: string;
	preferredName?: string;
	gender: string;
	dateOfBirth: string;
	email: string;
	phone: string;
	address: string;
	suburb: string;
	city: string;
	postCode: number;
	country: string;
}

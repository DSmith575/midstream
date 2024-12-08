export interface NavBarContentProps {
	home: { path: string; name: string };
	features: { path: string; name: string };
	about: { path: string; name: string };
	chat: { path: string; name: string };
}

export interface NavBarDropDownProps {
    login: { path: string; name: string };
    register: { path: string; name: string };
};
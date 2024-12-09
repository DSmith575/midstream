export interface NavBarContentProps {
	home: { path: string; name: string };
	features: { path: string; name: string };
	about: { path: string; name: string };
}

export interface NavBarDropDownProps {
	dashboard: { path: string; name: string };
    account: { path: string; name: string };
};
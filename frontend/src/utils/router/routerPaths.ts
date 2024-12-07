interface RouterPaths {
	home: string;
	login: string;
	register: string;
	features: string;
	about: string;
	profile: string;
	// dashboard: string;
	// profileEdit: string;
}

export const routerRoutes: RouterPaths = {
	home: '/',
	login: '/login',
	register: '/register',
	features: '/features',
	about: '/about',
	profile: '/profile',
	// dashboard: '/dashboard',
	// profileEdit: ':userId/edit',
};

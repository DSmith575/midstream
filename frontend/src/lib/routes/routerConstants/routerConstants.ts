export const routerConstants = {
	home: { path: '/', name: 'Home' },
	login: { path: '/login', name: 'Login' },
	register: { path: '/register', name: 'Register' },
	features: { path: '/features', name: 'Features' },
	about: { path: '/about', name: 'About' },
	chat: { path: '/chat', name: 'Chat' },
	// dashboard: { path: '/dashboard', name: 'dashboard' },
	profile: { path: '/profile', name: 'Profile' },
	profileUser: { path: ':userId', name: 'ProfileUser' },
	profileEdit: { path: ':userId/edit', name: 'ProfileEdit' },
}

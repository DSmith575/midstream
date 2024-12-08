import { routerConstants } from "@/lib/routes/routerConstants/routerConstants";
import { RouterPathProps } from "@/interfaces/routerInterfaces";

export const routerRoutes: RouterPathProps = {
	home: { path: routerConstants.home.path, name: routerConstants.home.name },
	login: { path: routerConstants.login.path, name: routerConstants.login.name },
	register: { path: routerConstants.register.path, name: routerConstants.register.name },
	features: { path: routerConstants.features.path, name: routerConstants.features.name },
	about: { path: routerConstants.about.path, name: routerConstants.about.name },
	chat: { path: routerConstants.chat.path, name: routerConstants.chat.name },
	// dashboard: { path: routerConstants.dashboard.path, name: routerConstants.dashboard.name },
	profile: { path: routerConstants.profile.path, name: routerConstants.profile.name },
	profileUser: { path: routerConstants.profileUser.path, name: routerConstants.profileUser.name },
	profileEdit: { path: routerConstants.profileEdit.path, name: routerConstants.profileEdit.name },
};
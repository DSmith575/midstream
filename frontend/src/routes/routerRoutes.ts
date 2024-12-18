import { routerConstants } from "@/routes/routerConstants/routerConstants";
import { RouterPathProps } from "@/interfaces/routerInterfaces";

export const routerRoutes: RouterPathProps = {
	home: { path: routerConstants.home.path, name: routerConstants.home.name },
	account: {
		path: routerConstants.account.path,
		name: routerConstants.account.name,
	},
	register: {
		path: routerConstants.register.path,
		name: routerConstants.register.name,
	},
	features: {
		path: routerConstants.features.path,
		name: routerConstants.features.name,
	},
	about: { path: routerConstants.about.path, name: routerConstants.about.name },
	dashboard: {
		path: routerConstants.dashboard.path,
		name: routerConstants.dashboard.name,
	},
	dashboardUser: {
		path: routerConstants.dashboardUser.path,
		name: routerConstants.dashboardUser.name,
	},
	dashboardUserEdit: {
		path: routerConstants.dashboardUserEdit.path,
		name: routerConstants.dashboardUserEdit.name,
	},
};

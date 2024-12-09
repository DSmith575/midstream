import { routerConstants } from "@/routes/routerConstants/routerConstants";
import { NavBarContentProps, NavBarDropDownProps } from "@/interfaces/navBarInterfaces";

export const navBarContentRoutes: NavBarContentProps = {
	home: { path: routerConstants.home.path, name: routerConstants.home.name },
	features: { path: routerConstants.features.path, name: routerConstants.features.name },
	about: { path: routerConstants.about.path, name: routerConstants.about.name },
};

export const navBarDropDownRoutes: NavBarDropDownProps = {
	dashboard: {path: routerConstants.dashboard.path, name: routerConstants.dashboard.name},
	login: { path: routerConstants.login.path, name: routerConstants.login.name },
	register: { path: routerConstants.register.path, name: routerConstants.register.name },
}
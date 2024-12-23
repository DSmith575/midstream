import logo from "@/assets/svgs/cccoil.svg";
import { cn } from "@/lib/utils";
import { routerRoutes } from "@/routes/routerRoutes";
import { Link } from "react-router";

const NavBarLogo = () => {
	return (
		<>
			<Link
				to={routerRoutes.home.path}
				className={"flex items-center justify-center"}>
				<img src={logo} alt="logo" className={cn("h-16 w-16")} />
				<p className={cn("font-bold text-inherit")}>
					MID<span className={cn("text-brand-700")}>STREAM</span>
				</p>
			</Link>
		</>
	);
};

export default NavBarLogo;

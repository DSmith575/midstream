import logo from '@/assets/svgs/cccoil.svg';
import { cn } from '@/utils';
import { routerRoutes } from '@/utils/router/routerPaths';
import { NavbarBrand, Link } from '@nextui-org/react';

const NavBarLogo = () => {
	return (
		<NavbarBrand className={cn('flex items-center')}>
			<img src={logo} alt="logo" className={cn('w-16 h-16')} />
			<Link href={routerRoutes.home}>
				<p className={cn('font-bold text-inherit')}>
					MID<span className={cn('text-brand-700')}>STREAM</span>
				</p>
			</Link>
		</NavbarBrand>
	);
};

export default NavBarLogo;

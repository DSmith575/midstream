import logo from '@/assets/svgs/cccoil.svg';
import { cn } from '@/utils';
import { routerRoutes } from '@/lib/routes/routerRoutes';
import { Link } from 'react-router';

const NavBarLogo = () => {
	return (
		<>
			<Link to={routerRoutes.home.path} className={'flex justify-center items-center'}>
				<img src={logo} alt="logo" className={cn('w-16 h-16')} />
					<p className={cn('font-bold text-inherit')}>
						MID<span className={cn('text-brand-700')}>STREAM</span>
					</p>
			</Link>
		</>
	);
};

export default NavBarLogo;

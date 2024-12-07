import {
	Navbar,
	NavbarContent,
	NavbarItem,
	Link,
	Button,
} from '@nextui-org/react';
import NavBarLogo from './navBarComponents/NavBarLogo';
import { routerRoutes } from '@/utils/router/routerPaths';
import { cn } from '@/utils';

const NavBar = () => {
	return (
		<Navbar shouldHideOnScroll maxWidth={'full'} className={cn('shadow-sm')}>
			<NavBarLogo />

			<NavbarContent className={cn('hidden sm:flex gap-4')} justify={'center'}>
				<NavbarItem>
					<Link
						color={'foreground'}
						className={cn('font-openSans')}
						href={routerRoutes.features}>
						Features
					</Link>
				</NavbarItem>
				<NavbarItem>
					<Link
						color={'foreground'}
						className={cn('font-openSans')}
						href={routerRoutes.about}>
						About
					</Link>
				</NavbarItem>
			</NavbarContent>
			<NavbarContent justify={'end'}>
				<NavbarItem className={cn('hidden lg:flex')}>
					<Link
						color={'foreground'}
						className={cn('font-openSans')}
						href={routerRoutes.login}>
						Login
					</Link>
				</NavbarItem>
				<NavbarItem>
					<Button
						as={Link}
						color={'danger'}
						href={routerRoutes.register}
						variant={'light'}
						className={cn('font-openSans')}>
						Register
					</Button>
				</NavbarItem>
			</NavbarContent>
		</Navbar>
	);
};

export default NavBar;

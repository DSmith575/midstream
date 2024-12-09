import NavBarLogo from '@/components/navBar/navBarComponents/NavBarLogo';
import {
	navBarContentRoutes,
	navBarDropDownRoutes,
} from '@/routes/navBarRoutes';
import NavItem from '@/components/navBar/navBarComponents/NavItem';
import {
	Sheet,
	SheetTrigger,
	SheetContent,
	SheetDescription,
} from '@/components/ui/sheet';
import { DialogTitle } from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

const NavBar = () => {
	const user = { name: 'John Doe',
		userId: 1,
	 };
	return (
		<section className="flex h-20 w-full shrink-0 items-center px-4 md:px-6 shadow-md">
			<Sheet>
				<SheetContent side="right">
					<DialogTitle className="sr-only">Menu</DialogTitle>
					<SheetDescription className="sr-only">
						Navigation menu
					</SheetDescription>
					<NavBarLogo />
					<div className="flex flex-col">
						<section className={'flex mb-4 shadow-sm rounded-sm'}>
							{Object.entries(navBarDropDownRoutes).map(([key, value]) =>
								// if user only show dashboard
								user && value.name === navBarDropDownRoutes.dashboard.name ? (
									<NavItem
										key={key}
										routerPath={`${value.path}/${user.userId}`}
										routerName={value.name}
									/>
								) : (
									// if user is not logged in show login and register
									!user &&
									value.name !== navBarDropDownRoutes.dashboard.name && (
										<NavItem
											key={key}
											routerPath={value.path}
											routerName={value.name}
										/>
									)
								),
							)}
						</section>

						{Object.entries(navBarContentRoutes).map(([key, value]) => (
							<NavItem
								key={key}
								routerPath={value.path}
								routerName={value.name}
							/>
						))}
					</div>
				</SheetContent>

				<nav className="w-full flex items-center justify-between">
					<NavBarLogo />
					<SheetTrigger asChild>
						<Button variant="outline" size="lg" className="">
							<Menu size={24} />
						</Button>
					</SheetTrigger>
				</nav>
			</Sheet>
		</section>
	);
};

export default NavBar;

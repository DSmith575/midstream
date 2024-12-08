import NavBarLogo from './navBarComponents/NavBarLogo';
import {
	navBarContentRoutes,
	navBarDropDownRoutes,
} from '@/lib/routes/navBarRoutes';
import NavItem from './navBarComponents/NavItem';
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
						{Object.entries(navBarContentRoutes).map(([key, value]) => (
							<NavItem
								key={key}
								routerPath={value.path}
								routerName={value.name}
							/>
						))}
						<section className={'flex'}>
							{Object.entries(navBarDropDownRoutes).map(([key, value]) => (
								<NavItem
									key={key}
									routerPath={value.path}
									routerName={value.name}
								/>
							))}
						</section>
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

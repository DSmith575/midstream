import {
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	Link,
	Button,
} from '@nextui-org/react';

const NavBar = () => {
	return (
		<Navbar isBordered shouldHideOnScroll>
			<NavbarBrand>
				<Link href="/">
				<h1 className="font-bold text-inherit">
					Mid<span className={'text-brand-700'}>Stream</span>
				</h1>
				</Link>
			</NavbarBrand>
			<NavbarContent className="hidden sm:flex gap-4" justify="center">
				<NavbarItem>
					<Link color="foreground" href="#">
						Features
					</Link>
				</NavbarItem>
				<NavbarItem isActive>
					<Link aria-current="page" href="#">
						Customers
					</Link>
				</NavbarItem>
				<NavbarItem>
					<Link color="foreground" href="#">
						Integrations
					</Link>
				</NavbarItem>
			</NavbarContent>
			<NavbarContent justify="end">
				<NavbarItem className="hidden lg:flex">
					<Link href="/login">Login</Link>
				</NavbarItem>
				<NavbarItem>
					<Button as={Link} color="primary" href="/signin" variant="flat">
						Sign Up
					</Button>
				</NavbarItem>
			</NavbarContent>
		</Navbar>
	);
};

export default NavBar;

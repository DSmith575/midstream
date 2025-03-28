import NavBarLogo from "@/components/navBar/navBarComponents/NavBarLogo";
import {
	navBarAuthRoutes,
	navBarContentRoutes,
	navBarDropDownRoutes,
} from "@/routes/navBarRoutes";
import NavItem from "@/components/navBar/navBarComponents/NavItem";
import {
	Sheet,
	SheetTrigger,
	SheetContent,
	SheetDescription,
} from "@/components/ui/sheet";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { SignedIn, useAuth, UserButton } from "@clerk/clerk-react";

const NavBar = () => {
	const { userId } = useAuth();

	return (
		<section className="flex h-20 w-full shrink-0 items-center px-4 shadow-md md:px-6">
			<Sheet>
				<SheetContent side="right">
					<DialogTitle className="sr-only">Menu</DialogTitle>
					<SheetDescription className="sr-only">
						Navigation menu
					</SheetDescription>
					<NavBarLogo />
					<section className="flex flex-col h-full">
						<section className={"my-8 flex shadow-sm"}>
							{Object.entries(navBarDropDownRoutes).map(([key, value]) =>
								// if user only show dashboard
								userId && value.name === navBarDropDownRoutes.dashboard.name ? (
									<NavItem
										key={key}
										routerPath={`${value.path}/${userId}`}
										routerName={value.name}
									/>
								) : (
									!userId &&
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

						<section>
						{Object.entries(navBarContentRoutes).map(([key, value]) => (
							<NavItem
								key={key}
								routerPath={value.path}
								routerName={value.name}
							/>
						))}
						</section>

						{userId && (
    <section className="mt-10">
      <NavItem
        routerPath={navBarAuthRoutes.analytics.path}
        routerName={navBarAuthRoutes.analytics.name}
      />
    </section>
  )}
					</section>
				</SheetContent>

				<nav className="flex w-full items-center justify-between">
					<NavBarLogo />
					<section className={"flex gap-4"}>
						<SignedIn>
							<UserButton
								appearance={{
									elements: {
										userButtonAvatarBox: "w-10 h-10",
									},
								}}
							/>
						</SignedIn>
						<SheetTrigger asChild>
							<Button variant="outline" size="lg" className="">
								<Menu size={24} />
							</Button>
						</SheetTrigger>
					</section>
				</nav>
			</Sheet>
		</section>
	);
};

export default NavBar;

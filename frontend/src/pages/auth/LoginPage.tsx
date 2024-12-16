import { routerRoutes } from "@/routes/routerRoutes";
import { SignIn } from "@clerk/clerk-react";

const LoginPage = () => {
	return (
		<section className={"flex h-[50vh] items-center justify-center"}>
			<SignIn signUpUrl={routerRoutes.register.path} />
		</section>
	);
};

export default LoginPage;

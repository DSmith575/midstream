import { routerRoutes } from "@/routes/routerRoutes";
import { SignUp } from "@clerk/clerk-react";

const RegisterPage = () => {
	return (
		<section className={"flex h-[50vh] items-center justify-center"}>
			<SignUp signInUrl={routerRoutes.account.path} />
		</section>
	);
};

export default RegisterPage;

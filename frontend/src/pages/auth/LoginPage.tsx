import { routerRoutes } from '@/routes/routerRoutes';
import {
	SignIn,
} from '@clerk/clerk-react';

const LoginPage = () => {
	return (
		<section className={'flex justify-center items-center h-[50vh]'}>
			<SignIn signUpUrl={routerRoutes.register.path}  />
		</section>
	);
};

export default LoginPage;

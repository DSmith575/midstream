import { routerRoutes } from '@/routes/routerRoutes';
import {
	SignUp,
} from '@clerk/clerk-react';

const RegisterPage = () => {
	return (
		<section className={'flex justify-center items-center h-[50vh]'}>
			<SignUp signInUrl={routerRoutes.account.path} />
		</section>
	);
};

export default RegisterPage;

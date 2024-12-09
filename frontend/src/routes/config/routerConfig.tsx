import { RootLayout } from '@/components/layouts/Layout';
import { routerRoutes } from '@/routes/routerRoutes';
import Dashboard from '@/pages/dashboard/Dashboard';

interface RouterConfigProps {
	path?: string;
	element?: JSX.Element;
	pageIndex?: boolean;
	children?: RouterConfigProps[];
}

export const routerConfig: RouterConfigProps[] = [
	{
		path: routerRoutes.home.path,
		element: <RootLayout />,
		children: [
			{
				pageIndex: true,
				element: <h1>Home</h1>,
			},
		],
	},
	{
		path: routerRoutes.features.path,
		element: <RootLayout />,
		children: [
			{
				pageIndex: true,
				element: <h1>Features</h1>,
			},
		],
	},
	{
		path: routerRoutes.about.path,
		element: <RootLayout />,
		children: [
			{
				pageIndex: true,
				element: <h1>About</h1>,
			},
		],
	},
	{
		path: routerRoutes.register.path,
		element: <RootLayout />,
		children: [
			{
				pageIndex: true,
				element: <h1>Register</h1>,
			},
		],
	},
	{
		path: routerRoutes.login.path,
		element: <RootLayout />,
		children: [
			{
				pageIndex: true,
				element: <h1>Login Test</h1>,
			},
		],
	},
	{
		path: routerRoutes.dashboard.path,
		element: <RootLayout/>,
		children: [
			{
				pageIndex: true,
				element: <h1>404</h1>,
			},
			{
				path: routerRoutes.dashboardUser.path,
				element: <Dashboard/>,
			},
			{
				path: routerRoutes.dashboardUserEdit.path,
				element: <h1>UserId Edit Test</h1>,
			},
		],
	},
];

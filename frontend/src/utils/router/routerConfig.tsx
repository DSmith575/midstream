import { RootLayout } from '@/lib/components/layouts/Layout';
import { routerRoutes } from './routerPaths';

interface RouterConfig {
	path?: string;
	element: JSX.Element;
	pageIndex?: boolean;
	children?: RouterConfig[];
}

export const routerConfig: RouterConfig[] = [
	{
		path: routerRoutes.home,
		element: <RootLayout />,
		children: [
			{
				pageIndex: true,
				element: <h1>Test</h1>,
			},
		],
	},
	{
		path: routerRoutes.features,
		element: <RootLayout />,
		children: [
			{
				pageIndex: true,
				element: <h1>Features</h1>,
			},
		],
	},
	{
		path: routerRoutes.about,
		element: <RootLayout />,
		children: [
			{
				pageIndex: true,
				element: <h1>About</h1>,
			},
		],
	},
	{
		path: routerRoutes.register,
		element: <RootLayout />,
		children: [
			{
				pageIndex: true,
				element: <h1>Register</h1>,
			},
		],
	},
	{
		path: routerRoutes.login,
		element: <RootLayout />,
		children: [
			{
				pageIndex: true,
				element: <h1>Login Test</h1>,
			},
		],
	},
	{
		path: routerRoutes.profile,
		element: <RootLayout children={<h1>Profile Page Test Layout</h1>} />,
		children: [
			{
				pageIndex: true,
				element: <h1>Profile Test</h1>,
			},
			{
				path: ':userId',
				element: <h1>User Id Here</h1>,
			},
			{
				path: ':userId/edit',
				element: <h1>UserId Edit Test</h1>,
			},
		],
	},
];

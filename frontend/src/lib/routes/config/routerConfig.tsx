import { RootLayout } from '@/lib/components/layouts/Layout';
import { routerRoutes } from '@/lib/routes/routerRoutes';
import ChatPage from '@/lib/components/pages/chat/ChatPage';

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
		path: routerRoutes.chat.path,
		element: <RootLayout />,
		children: [
			{
				pageIndex: true,
				element: <ChatPage/>,
			},
		],
	},
	{
		path: routerRoutes.profile.path,
		element: <RootLayout children={<h1>Profile Page Test Layout</h1>} />,
		children: [
			{
				pageIndex: true,
				element: <h1>Profile Test</h1>,
			},
			{
				path: routerRoutes.profileUser.path,
				element: <h1>User Id Here</h1>,
			},
			{
				path: routerRoutes.profileEdit.path,
				element: <h1>UserId Edit Test</h1>,
			},
		],
	},
];

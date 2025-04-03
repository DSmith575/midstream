import { RootLayout } from "@/components/layouts/Layout";
import { routerRoutes } from "@/routes/routerRoutes";
import Dashboard from "@/pages/dashboard/Dashboard";
import LoginPage from "@/pages/auth/LoginPage";
import HomePage from "@/pages/home/HomePage";
import RegisterPage from "@/pages/auth/RegisterPage";
import AnalyticsPage from "@/pages/analytics/Analytics";
import ReferralForm from "@/components/forms/referralForm/ReferralForm";
import ProfileForm from "@/components/forms/profileForm/ProfileForm";

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
				element: <HomePage />,
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
		path: routerRoutes.account.path,
		element: <RootLayout />,
		children: [
			{
				pageIndex: true,
				element: <LoginPage />,
			},
		],
	},
	{
		path: routerRoutes.register.path,
		element: <RootLayout />,
		children: [
			{
				pageIndex: true,
				element: <RegisterPage />,
			},
		],
	},
	{
		path: routerRoutes.dashboard.path,
		element: <RootLayout />,
		children: [
			{
				pageIndex: true,
				element: <h1>404</h1>,
			},
			{
				path: routerRoutes.dashboardUser.path,
				element: <Dashboard />,
			},
			{
				path: routerRoutes.dashboardUserEdit.path,
				element: <h1>UserId Edit Test</h1>,
			},
			{
				path: routerRoutes.dashboardNewReferral.path,
				element: <ReferralForm />,
			},
			{
				path: routerRoutes.dashboardProfileSetup.path,
				element: <ProfileForm/>
			}
		],
	},
	{
		path: routerRoutes.analytics.path,
		element: <RootLayout />,
		children: [
			{
				pageIndex: true,
				element: <AnalyticsPage />,
			},
		],
	}
];

import { Outlet } from 'react-router';
import NavBar from '../navBar/NavBar';

interface LayoutProps {
	children?: JSX.Element;
}

export const RootLayout = ({}: LayoutProps) => {
	return (
		<>
			<NavBar />
			<Outlet />
		</>
	);
};
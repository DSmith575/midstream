import { Link } from 'react-router';
import { cn } from '@/utils';

interface NavBarItemProps {
	routerPath: string;
	routerName: string;
}

const NavItem = ({ routerPath, routerName }: NavBarItemProps) => {
	return (
		<Link
			className={cn(
				'justify-center flex w-full items-center py-2 text-lg font-semibold hover:text-blue-500',
			)}
			to={routerPath}>
			{routerName}
		</Link>
	);
};

export default NavItem;

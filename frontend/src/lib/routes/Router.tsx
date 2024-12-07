import { BrowserRouter, Routes, Route } from 'react-router';
import { routerConfig } from '@/utils/router/routerConfig';

const Router = () => {
	return (
		<BrowserRouter>
			<Routes>
				{routerConfig.map((route) => (
					<Route path={route.path} element={route.element}>
						{route.children?.map((child) => (
							<Route
								path={child.path}
								index={child.pageIndex}
								element={child.element}
							/>
						))}
					</Route>
				))};
			</Routes>
		</BrowserRouter>
	);
};

export default Router;

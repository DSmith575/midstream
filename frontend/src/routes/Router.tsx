import { BrowserRouter, Routes, Route } from "react-router";
import { routerConfig } from "@/routes/config/routerConfig";

const Router = () => {
	return (
		<BrowserRouter>
			<Routes>
				{routerConfig.map((route) => (
					<Route path={route.path} element={route.element} key={route.path}>
						{route.children?.map((child) => (
							<Route
								key={route.path}
								path={child.path}
								index={child.pageIndex}
								element={child.element}
							/>
						))}
					</Route>
				))}
			</Routes>
		</BrowserRouter>
	);
};

export default Router;

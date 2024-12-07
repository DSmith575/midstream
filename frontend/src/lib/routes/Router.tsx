import { BrowserRouter, Routes, Route, Outlet } from 'react-router';
import NavBar from '@/lib/components/navBar/NavBar';

const AppLayout = () => {
	return (
		<>
			<NavBar />
			<Outlet />
		</>
	);
};

const Router: React.FC = () => {
	return (
		<BrowserRouter>
			<Routes>
                <Route element={<AppLayout />}>
				<Route index path={'/'} element={<h1>Test</h1>} />
				<Route path="/login" element={<h1>Test2</h1>}/>
                </Route>
			</Routes>
		</BrowserRouter>
	);
};

export default Router;

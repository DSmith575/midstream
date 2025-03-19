import Router from "@/routes/Router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

const App = () => {
	return (
		<>
			<QueryClientProvider client={queryClient}>
				<Router />
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</>
	);
};

export default App;

import { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
  LineElement,
	BarElement,
	ArcElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
  LineElement,
	BarElement,
	ArcElement,
	Title,
	Tooltip,
	Legend,
);

const getAnalytics = async () => {
	const response = await fetch(
		"http://localhost:3000/api/v1/analytics/getAnalytics",
	);
	const data = await response.json();
	return data;
};

const AnalyticsPage = () => {
	const [analyticsData, setAnalyticsData] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchAnalytics = async () => {
			try {
				const data = await getAnalytics();
				setAnalyticsData(data);
			} catch (err) {
				setError("Failed to fetch analytics data.");
			} finally {
				setLoading(false);
			}
		};

		fetchAnalytics();
	}, []);

	if (loading) return <p className="text-center">Loading analytics data...</p>;
	if (error) return <p className="text-center text-red-500">{error}</p>;

	if (!analyticsData) return <p className="text-center">No data available.</p>;

	// Prepare data for charts
	const ageGroups = analyticsData.ageGroups || {};
	const genderDistribution = analyticsData.genderDistribution || {};
	const cityDistribution = analyticsData.cityDistribution || {};

	const ageData = {
		labels: Object.keys(ageGroups),
		datasets: [
			{
				label: "Count",
				data: Object.values(ageGroups),
				backgroundColor: "rgba(75, 192, 192, 0.6)",
				borderColor: "rgba(75, 192, 192, 1)",
				borderWidth: 1,
			},
		],
	};

	const genderData = {
		labels: Object.keys(genderDistribution),
		datasets: [
			{
				label: "Count",
				data: Object.values(genderDistribution),
				backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
			},
		],
	};

	const cityData = {
		labels: Object.keys(cityDistribution),
		datasets: [
			{
				label: "Count",
				data: Object.values(cityDistribution),
				backgroundColor: "rgba(153, 102, 255, 0.6)",
				borderColor: "rgba(153, 102, 255, 1)",
				borderWidth: 1,
			},
		],
	};

	return (
		<section className="px-4 mt-2">
			<h1 className="mb-4 text-center text-2xl font-bold">Analytics</h1>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{/* Age Groups Bar Chart */}
				<div className="rounded-lg bg-white p-4 shadow-md">
					<h2 className="mb-2 text-center text-lg font-medium">Age Range</h2>
					<Bar
						data={ageData}
						options={{
							responsive: true,
							maintainAspectRatio: true,
							scales: { y: { ticks: { stepSize: 1 } } },
						}}
					/>
				</div>

				{/* City Distribution Bar Chart */}
				<div className="rounded-lg bg-white p-4 shadow-md">
					<h2 className="mb-2 text-center text-lg font-medium">
						City Distribution
					</h2>
					<Bar
						data={cityData}
						options={{
							responsive: true,
							maintainAspectRatio: true,
							scales: { y: { ticks: { stepSize: 1 } } },
						}}
					/>
				</div>

				{/* Gender Distribution Pie Chart */}
				<div className="flex flex-col items-center justify-center rounded-lg bg-white p-4 shadow-md">
					<h2 className="mb-2 text-center text-lg font-medium">
						Gender Distribution
					</h2>
					<div className={'w-80 h-80'}>
						<Pie
							data={genderData}
							options={{
								responsive: true,
								maintainAspectRatio: true,
							}}
						/>
					</div>
				</div>

       
			</div>
		</section>
	);
};

export default AnalyticsPage;

import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/clerk-react";
import useUserProfile from "@/hooks/userProfile/useUserProfile";
import Spinner from "@/components/spinner/Spinner";
import ProfileSetup from "@/components/profileSetup/ProfileSetup";
import useGetReferralForms from "@/hooks/userProfile/useGetReferralForms";
import ReferralFormButton from "@/components/referralForms/ReferralFormButton";
import { Link } from "react-router";
import DataTable from "@/components/table/DataTable";
import UserProfileCard from "@/components/profile/card/UserProfileCard";

const Dashboard = () => {
	const { isLoaded, userId, orgRole } = useAuth();
	const { isLoading, isError, error, userData } = useUserProfile(userId || "");
	const { referralForms } = useGetReferralForms(userId || "");

	if (!isLoaded || !userId) return null;

	return (
		<section>
			{isLoading && (
				<div className="mt-12 flex items-center justify-center">
					<Spinner />
				</div>
			)}

			{isError && (
				<div className="mt-12 flex flex-col items-center justify-center">
					<p className="text-red-500">Sign in to get started!</p>
					{error && (
						<p className="text-sm text-muted-foreground">{error.message}</p>
					)}
				</div>
			)}

			{!isLoading && !isError && userData ? (
				<div className="min-h-[50vh] bg-gray-100 p-4">
					{orgRole === "org:admin" ? (
						<>
							{userData.personalInformation && (
								<div className="mt-4">
									<p>
										Hello {userData.personalInformation.firstName}{" "}
										{userData.personalInformation.lastName}
									</p>
									<DataTable />
								</div>
							)}
						</>
					) : (
						<section className="grid grid-cols-1 items-start gap-2 md:grid-cols-3">
							{/* Profile Card */}
							<div className="col-span-2 min-h-[300px] rounded-2xl bg-white p-6 shadow-lg">
								{userData && <UserProfileCard userProfile={userData} />}
							</div>

							{/* Application Card */}
							<div className="col-span-3 row-start-3 flex flex-col rounded-2xl bg-white p-6 shadow-lg md:col-start-1 md:row-start-3 lg:col-start-1">
								<div className="flex items-center justify-between">
									<h3 className="text-lg font-semibold">My Applications</h3>
									<Button asChild>
										<Link to={`/dashboard/${userId}/referral`}>New Form</Link>
									</Button>
								</div>
								<div className="mt-4 max-h-[300px] space-y-2 overflow-y-auto">
									{/* map referralForms */}
									{referralForms &&
										referralForms.map((form: any, idx: number) => (
											<div
												key={idx}
												className="flex items-center justify-between pr-4 text-sm">
												<ReferralFormButton referralForm={form} />
												<p
													className={`rounded-full px-3 py-1 ${
														form.status === "SUBMITTED"
															? "bg-green-100"
															: "bg-red-100"
													}`}>
													{form.status}
												</p>
											</div>
										))}
								</div>
							</div>

							{/* Bills Card */}
							<div className="col-start-1 max-h-[300px] min-h-[300px] space-y-2 overflow-y-auto rounded-2xl bg-white p-6 shadow-lg md:col-start-3">
								<h3 className="text-lg font-semibold">My Bills</h3>
								<div className="mt-4 space-y-2">
									{[
										{ name: "Phone bill", status: "paid" },
										{ name: "Internet bill", status: "not paid" },
										{ name: "House rent", status: "paid" },
										{ name: "Income tax", status: "paid" },
									].map((bill, idx) => (
										<div
											key={idx}
											className="flex items-center justify-between text-sm">
											<p>{bill.name}</p>
											<span
												className={`rounded-full px-3 py-1 ${
													bill.status === "paid"
														? "bg-green-100 text-green-500"
														: "bg-red-100 text-red-500"
												}`}>
												{bill.status === "paid" ? "Paid" : "Not paid"}
											</span>
										</div>
									))}
								</div>
							</div>
						</section>
					)}
				</div>
			) : null}

			{/* Profile Setup or Form */}
			{!isLoading && !isError && !userData && (
				<>
					<ProfileSetup userGoogleId={userId} />
				</>
			)}
		</section>
	);
};

export default Dashboard;

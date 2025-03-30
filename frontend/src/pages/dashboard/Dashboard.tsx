import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/clerk-react";
import ProfileForm from "@/components/forms/profileForm/ProfileForm";
import useUserProfile from "@/hooks/userProfile/useUserProfile";
import Spinner from "@/components/spinner/Spinner";
import ProfileSetup from "@/components/profileSetup/ProfileSetup";
import useProfileStart from "@/hooks/profileForm/useProfileStart";
import useGetReferralForms from "@/hooks/userProfile/useGetReferralForms";
import ReferralFormButton from "@/components/referralForms/ReferralFormButton";
import { Link } from "react-router";
import { OrganizationSwitcher } from "@clerk/clerk-react";
import AnalyticsPage from "../analytics/Analytics";

const Dashboard = () => {
	const { isLoaded, userId, orgRole } = useAuth();
	console.log(orgRole)
	const { isLoading, isError, error, userData } = useUserProfile(userId || "");
	// const { isLoading: refFormLoading, isError: refFormHasError, error: refFormError, userReferralForms } = useGetReferralForms(userId || "");
	const { referralForms } = useGetReferralForms(userId || "");
	const { profileStart, handleProfileStart } = useProfileStart();
	if (!isLoaded || !userId) {
		return null;
	}

	return (
		<section>
			{/* Loading State */}
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
				<div className="min-h-[50vh] bg-gray-100 p-8">
					<OrganizationSwitcher />
					{orgRole === "org:admin" ? (
						<div className="mt-4">
							<AnalyticsPage />
						</div>
					) : (
					<div className="grid grid-cols-1 items-start gap-2 md:grid-cols-3">
						{/* Profile Card */}
						<div className="col-span-2 min-h-[300px] rounded-2xl bg-white p-6 shadow-lg">
							{/* User Information */}
							{userData.personalInformation && (
								<>
									<h1 className="mt-2 text-xl text-muted-foreground">
										{userData.personalInformation.title}{" "}
										{userData.personalInformation.firstName}{" "}
										{userData.personalInformation.lastName}
									</h1>
									<p className="text-sm text-muted-foreground">
										{userData.personalInformation.preferredName}
									</p>
									<p className="text-sm text-muted-foreground">
										{userData.personalInformation.gender}
									</p>
									<p className="text-sm text-muted-foreground">
										{new Date().getFullYear() -
											new Date(
												userData.personalInformation.dateOfBirth,
											).getFullYear()}
									</p>
								</>
							)}
							{/* Address */}
							{userData.addressInformation && (
								<section className="mt-4">
									<h3 className="font-semibold">Address:</h3>
									<p className="text-sm text-muted-foreground">
										{userData.addressInformation.address}
									</p>
									<p className="text-sm text-muted-foreground">
										{userData.addressInformation.suburb}
									</p>
									<p className="text-sm text-muted-foreground">
										{userData.addressInformation.city}
									</p>
									<p className="text-sm text-muted-foreground">
										{userData.addressInformation.postCode}
									</p>
								</section>
							)}
							{/* Contact */}
							{userData.contactInformation && (
								<section className="mt-4">
									<h3 className="font-semibold">Contact:</h3>
									<p className="text-sm text-muted-foreground">
										<span className="text-black">Email: </span>{" "}
										{userData.contactInformation.email}
									</p>
									<p className="text-sm text-muted-foreground">
										<span className="text-black">Phone: </span>
										{userData.contactInformation.phone}
									</p>
								</section>
							)}
							<button className="mt-6 rounded-lg bg-green-500 px-8 py-2 text-white shadow">
								Edit
							</button>
						</div>

						{/* Application Card */}
						<div className="col-span-2 row-start-2 flex min-h-[100%] flex-col rounded-2xl bg-white p-6 shadow-lg md:col-start-1 md:row-start-2 lg:col-start-3 lg:row-start-1">
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
											className="flex items-center justify-between text-sm">
											<ReferralFormButton referralForm={form} />
											<span
												className={`rounded-full px-3 py-1 ${
													form.status === "SUBMITTED"
														? "bg-green-100"
														: "bg-red-100"
												}`}>
												{form.status}
											</span>
										</div>
									))}
							</div>
						</div>

						{/* Bills Card */}
						<div className="col-span-2 row-start-3 rounded-2xl bg-white p-6 shadow-lg md:col-span-1">
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
					</div>
			)};
				</div>
			) : null}

			{/* Profile Setup or Form */}
			{!isLoading && !isError && !userData && (
				<>
					{profileStart ? (
						<>
							<section className="mr-10 mt-2 grid justify-end">
								<Button
									variant="outline"
									size="lg"
									className="ml-2"
									onClick={() => handleProfileStart(false)}>
									Back
								</Button>
								<p className="ml-2 text-sm text-muted-foreground">
									Progress will not be saved.
								</p>
							</section>
							<ProfileForm />
						</>
					) : (
						<ProfileSetup onClick={() => handleProfileStart(true)} />
					)}
				</>
			)}
		</section>
	);
};

export default Dashboard;

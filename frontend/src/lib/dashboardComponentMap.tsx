import UserProfileCard from "@/components/profile/card/userCard/UserProfileCard";
import BillsCard from "@/components/profile/card/bills/BillsCard";
import ApplicationCard from "@/components/profile/card/applicationCard/ApplicationCard";
import type { UserProfileProps } from "@/lib/interfaces";
import type { JSX } from "react";
import type { CardKeyUser, CardKeyWorker } from "@/lib/types";
// import WorkerReferralTable from "@/components/dashboard/WorkerReferralTable";
import WorkerReferralTable from "@/components/dashboard/WorkerNewReferralTable";
import workerNewRefColumns from "./table/columns/WorkerNewRefColumns";


export const getComponentMapUser = (
  userData: UserProfileProps,
  userId: string
): Record<CardKeyUser, () => JSX.Element> => ({
  Account: () => <UserProfileCard userProfile={userData} />,
  Applications: () => <ApplicationCard userId={userId} />,
  Budget: () => <BillsCard />,
  Schedule: () => (
    <div className="p-4 bg-white rounded-lg shadow">Schedule Component</div>
  ),
});

export const getComponentMapWorker = (
  userData: UserProfileProps,
  userId: string,
  companyId: number,
): Record<CardKeyWorker, () => JSX.Element> => (
  {
  Account: () => <UserProfileCard userProfile={userData} />,
  Referrals: () => <p>Test</p>,
  NewReferrals: () => <WorkerReferralTable caseWorkerId={userId} companyId={companyId} columns={workerNewRefColumns} />,
  Schedule: () => (
    <div className="p-4 bg-white rounded-lg shadow">Schedule Component</div>
  ),
});

import type { JSX } from 'react'
import type { UserProfileProps } from '@/lib/interfaces'
import type { CardKeyUser, CardKeyWorker } from '@/lib/types'
import { workerNewRefColumns } from '@/lib/table/columns/WorkerNewRefColumns'
import { UserProfileCard } from '@/components/profile/card/userCard/UserProfileCard'
import { BillsCard } from '@/components/profile/card/bills/BillsCard'
import { ApplicationCard } from '@/components/profile/card/applicationCard/ApplicationCard'
import { WorkerReferralTable } from '@/components/dashboard/WorkerNewReferralTable'
import { CaseWorkerTable } from '@/components/workerCaseTable'
import { caseWorkerColumns } from '@/lib/table/columns/caseWorkerColumns'

export const getComponentMapUser = (
  userData: UserProfileProps,
  userId: string,
): Record<CardKeyUser, () => JSX.Element> => ({
  Account: () => <UserProfileCard userProfile={userData} />,
  Applications: () => <ApplicationCard userId={userId} />,
  Budget: () => <BillsCard />,
  Schedule: () => (
    <div className="p-4 bg-white rounded-lg shadow">Schedule Component</div>
  ),
})

export const getComponentMapWorker = (
  userData: UserProfileProps,
  userId: string,
  companyId: number,
): Record<CardKeyWorker, () => JSX.Element> => ({
  Account: () => <UserProfileCard userProfile={userData} />,
  AssignedCases: () => (
    <CaseWorkerTable caseWorkerId={userId} columns={caseWorkerColumns} />
  ),
  NewReferrals: () => (
    <WorkerReferralTable
      caseWorkerId={userId}
      companyId={companyId}
      columns={workerNewRefColumns}
    />
  ),
  Schedule: () => (
    <div className="p-4 bg-white rounded-lg shadow">Schedule Component</div>
  ),
})

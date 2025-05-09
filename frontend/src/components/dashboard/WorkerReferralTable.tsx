import useGetAllCompanyReferrals from '@/hooks/workerReferrals/useGetAllCompanyReferrals'
import type { UserProfileProps } from '@/lib/interfaces'

interface WorkerProps {
  userData: UserProfileProps
}

const WorkerReferralTable = ({ userData }: WorkerProps) => {
  const companyId = userData?.companyId;

  const { isLoading, data: referrals } = useGetAllCompanyReferrals({
    options: { enabled: !!companyId },
    companyId: companyId!,
  });

  return <p>Test</p>;
};

export default WorkerReferralTable

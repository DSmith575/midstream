import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import ReferralFormApplication from '@/components/referralForms/ReferralFormApplication'
import useGetReferralForms from '@/hooks/userProfile/useGetReferralForms'
import Spinner from '@/components/spinner/Spinner';

interface ApplicationCardProps {
  userId: string;
}

const ApplicationCard = ({ userId }: ApplicationCardProps) => {
  const { error, isLoading, referralForms } = useGetReferralForms(userId);

  return (
    <div className="max-h-[300px] col-span-1 flex flex-col rounded-2xl bg-white p-6 shadow-lg md:col-span-2">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">My Applications</h2>
        <Button asChild className={'bg-green-500 hover:bg-blue-500'}>
          <Link to="/dashboard/referral/$userId" params={{ userId }}>New Form</Link>
        </Button>
      </div>
      <div className="mt-4 max-h-[300px] space-y-2 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-10">
            <p className="text-red-500">An error has occurred.</p>
            <p className="text-sm text-muted-foreground">Please try again later</p>
          </div>
        ) : (
          referralForms?.map((form: any, idx: number) => (
            <div
              key={idx}
              className="flex items-center justify-between pr-4 text-sm"
            >
              <ReferralFormApplication referralForm={form} />
              <p
                className={`rounded-full px-3 py-1 ${
                  form.status === 'SUBMITTED' ? 'bg-green-100' : 'bg-red-100'
                }`}
              >
                {form.status}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ApplicationCard;

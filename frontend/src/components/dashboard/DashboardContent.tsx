import useUserProfile from '@/hooks/userProfile/useUserProfile'
import ProfileForm from '../forms/referralForm/profileForm/ProfileForm'
import CompanyList from '../companyList/CompanyList'
import ProfileHoverCards from '@/components/profile/ProfileHoverCards'
import { getComponentMapUser } from '@/lib/dashboardComponentMap'
import { roleConstants } from '@/lib/constants'

interface DashBoardContentProps {
  userId: string
  orgRole?: string | null
}

const DashboardContent = ({ userId }: DashBoardContentProps) => {
  const { userData, error } = useUserProfile(userId)

  if (error && !userData) {
    return (
      <div className="mt-12 flex flex-col items-center justify-center">
        <p className="text-red-500">An error has occurred.</p>
        <p className="text-sm text-muted-foreground">Please try again later</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div>
        <ProfileForm />
      </div>
    );
  }

  return (
    <main className="min-h-[90vh] bg-[#eff0f0] px-2.5">
        <>
          {userData.role === roleConstants.client ? (
            <>
              {!userData.company && userData.addressInformation ? (
                <CompanyList userId={userId} userCity={userData.addressInformation.city} />
              ) : (
                <div className="grid grid-cols-1 items-start gap-2 lg:grid-cols-3">
                <ProfileHoverCards componentMap={getComponentMapUser(userData, userId)} />
                </div>
              )}
            </>
          ) : (
            <div className="grid grid-cols-1 items-start gap-2 lg:grid-cols-3">
            {/* <ProfileHoverCards componentMap={getComponentMapWorker(userData, userId)} /> */}
            </div>
          )}
        </>
    </main>
  )
}

export default DashboardContent

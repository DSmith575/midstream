import useUserProfile from '@/hooks/userProfile/useUserProfile'
import UserProfileCard from '@/components/profile/card/userCard/UserProfileCard'
import ApplicationCard from '@/components/profile/card/applicationCard/ApplicationCard'
import BillsCard from '@/components/profile/card/bills/BillsCard'
import ProfileForm from '../forms/referralForm/profileForm/ProfileForm'

interface DashBoardContentProps {
  userId: string
  orgRole?: string | null
}


const DashboardContent = ({ userId }: DashBoardContentProps) => {
  const { userData, error } = useUserProfile(userId)


  

  if (error) {
    return (
      <div className="mt-12 flex flex-col items-center justify-center">
        <p className="text-red-500">An error has occurred.</p>
        <p className="text-sm text-muted-foreground">Please try again later</p>
      </div>
    )
  }

  if (!userData) {
    return (
      <div>
        <ProfileForm />
      </div>
    )
  }


  return (
    <main className="min-h-[90vh] bg-gray-100 p-4">
      <div className="grid grid-cols-1 items-start gap-2 lg:grid-cols-3 ">
        <>
          {userData.role === 'CLIENT' ? (
            <>
                <UserProfileCard userProfile={userData} />
              <ApplicationCard userId={userId} />
              <BillsCard />
            </>
          ) : (
            <section className="col-span-1 min-h-[300px] rounded-2xl bg-white p-6 shadow-lg">
              <p>Admin</p>
            </section>
          )}
        </>
      </div>
    </main>
  )
}

export default DashboardContent

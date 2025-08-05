import { useUserProfile } from '@/hooks/userProfile/useUserProfile'
import { ProfileForm } from '@/components/forms/profileForm/ProfileForm'
import { CompanyList } from '@/components/companyList/CompanyList'
import { ProfileHoverCards } from '@/components/profile/ProfileHoverCards'
import {
  getComponentMapUser,
  getComponentMapWorker,
} from '@/lib/dashboardComponentMap'
import { roleConstants } from '@/lib/constants'
import { DevToolButton } from '@/components/devTools'
import { postChangeUserRole } from '@/lib/api/devTools/postChangeUserRole'

type UserRoles = 'CLIENT' | 'WORKER'

interface DashBoardContentProps {
  userId: string
}

// Testing
const onClickSwitchUserRole = async (userId: string, role: UserRoles) => {
  try {
    const response = await postChangeUserRole({ userId, role })
    if (response) {
      console.log('User role switched successfully:', response)
      window.location.reload()
    } else {
      console.error('Failed to switch user role')
    }
  } catch (error) {
    console.error('Error switching user role:', error)
  }
}

export const DashboardContent = ({ userId }: DashBoardContentProps) => {
  const { userData, error } = useUserProfile(userId)

  if (!!error && !userData) {
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
    <main className="min-h-[90vh] bg-[#eff0f0] px-2.5">
      <>
        {userData.role === roleConstants.client ? (
          <>
            {!userData.company && userData.addressInformation ? (
              <CompanyList
                userId={userId}
                // userCity={userData.addressInformation.city}
              />
            ) : (
              <>
                <div className="grid grid-cols-1 items-start gap-2 lg:grid-cols-3">
                  <ProfileHoverCards
                    componentMap={getComponentMapUser(userData, userId)}
                  />
                  <DevToolButton
                    text="Test - Switch to worker"
                    onClick={() => {
                      onClickSwitchUserRole(
                        userId,
                        roleConstants.worker as UserRoles,
                      )
                    }}
                    buttonText="Switch Role"
                  />
                </div>
              </>
            )}
          </>
        ) : (
          <>
            {userData.companyId && (
              <div className="grid grid-cols-1 items-start gap-2 lg:grid-cols-3">
                <ProfileHoverCards
                  componentMap={getComponentMapWorker(
                    userData,
                    userId,
                    userData.companyId,
                  )}
                />
                <DevToolButton
                  text="Test - Switch to client"
                  onClick={() => {
                    onClickSwitchUserRole(
                      userId,
                      roleConstants.client as UserRoles,
                    )
                  }}
                  buttonText="Switch Role"
                />
              </div>
            )}
          </>
        )}
      </>
    </main>
  )
}

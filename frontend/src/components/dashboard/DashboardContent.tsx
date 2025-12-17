
import { ProfileForm } from '@/components/forms/profileForm/ProfileForm'
import { CompanyList } from '@/components/companyList/CompanyList'
import { ProfileHoverCards } from '@/components/profile/ProfileHoverCards'
import {
  // getComponentMapUser,
  getComponentMapWorker,
} from '@/lib/dashboardComponentMap'
import { roleConstants } from '@/lib/constants'
import { AppSidebar } from '@/components/sidebar/Sidebar'
// import { SectionCards } from '@/components/section-cards'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { SIDEBAR_VIEWS, type SidebarViewKey } from '../sidebar/SidebarViews'
import { useState } from 'react'
import { Spinner } from '../spinner'

import { useUserProfile } from '@/hooks/userProfile/useUserProfile'

interface DashBoardContentProps {
  userId: string
}

export const DashboardContent = ({ userId }: DashBoardContentProps) => {
  const { userData, error, isLoading } = useUserProfile(userId)
  const [view, setView] = useState<SidebarViewKey>('user')
  const ViewComponent = SIDEBAR_VIEWS[view].component

  if (!!error && !userData) {
    return (
      <div className="mt-12 flex flex-col items-center justify-center">
        <p className="text-red-500">An error has occurred.</p>
        <p className="text-sm text-muted-foreground">Please try again later</p>
      </div>
    )
  }

  if (isLoading) {
    return <Spinner />
  }

  if (!userData) {
    return (
      <div>
        <ProfileForm />
      </div>
    )
  }

  return (
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
              <div>
                {/* <ProfileHoverCards
                    componentMap={getComponentMapUser(userData, userId)}
                  /> */}
                <SidebarProvider
                  style={
                    {
                      '--sidebar-width': 'calc(var(--spacing) * 72)',
                      '--header-height': 'calc(var(--spacing) * 12)',
                    } as React.CSSProperties
                  }
                >
                  <AppSidebar
                    variant="sidebar"
                    userName={`${userData.personalInformation?.firstName} ${userData.personalInformation?.lastName}`}
                    current={view}
                    onViewChange={setView}
                  />

                  <SidebarInset>
                    <SiteHeader selectedView={SIDEBAR_VIEWS[view].label} />

                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 @container/main">
                      <ViewComponent userId={userId} />
                    </div>
                  </SidebarInset>
                </SidebarProvider>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          {userData.companyId && (
            <div className="grid grid-cols-1 items-start gap-2">
              <ProfileHoverCards
                componentMap={getComponentMapWorker(
                  userData,
                  userId,
                  userData.companyId,
                )}
              />
            </div>
          )}
        </>
      )}
    </>
  )
}

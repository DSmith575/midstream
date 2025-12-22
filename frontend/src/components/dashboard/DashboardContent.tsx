import { useState } from 'react'
import { Spinner } from '../spinner'
import type {SidebarViewKey} from '@/components/sidebar';
import { ProfileForm } from '@/components/forms/profileForm/ProfileForm'
import { CompanyList } from '@/components/companyList/CompanyList'
import { roleConstants } from '@/lib/constants'

import { useUserProfile } from '@/hooks/userProfile/useUserProfile'
import {
  SIDEBAR_VIEWS,
  SidebarApp,
  SidebarSiteHeader,
  
  SidebarWrapper
} from '@/components/sidebar'
import { SidebarInset } from '@/components/ui/sidebar'

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
      {userData.role === roleConstants.client && (
        <>
          {!userData.company && userData.addressInformation ? (
            <CompanyList userId={userId} />
          ) : (
            <>
              <SidebarWrapper>
                <SidebarApp
                  variant="sidebar"
                  userName={`${userData.personalInformation?.firstName} ${userData.personalInformation?.lastName}`}
                  current={view}
                  onViewChange={setView}
                />

                <SidebarInset>
                  <SidebarSiteHeader selectedView={SIDEBAR_VIEWS[view].label} />
                  <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 @container/main">
                    <ViewComponent userId={userId} />
                  </div>
                </SidebarInset>
              </SidebarWrapper>
            </>
          )}
        </>
      )}
    </>
  )
}

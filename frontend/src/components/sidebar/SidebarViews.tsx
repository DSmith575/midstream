import { IconDashboard, IconListDetails } from '@tabler/icons-react'
import { UserView } from '@/components/dashboard/UserViewDashboard'
import { ApplicationView } from '@/components/dashboard/UserApplicationViewDashboard'


export const SIDEBAR_VIEWS = {
  user: {
    label: 'Profile',
    icon: IconDashboard,
    component: UserView,
  },
  application: {
    label: 'Applications',
    icon: IconListDetails,
    component: ApplicationView,
  },
}

export type SidebarViewKey = keyof typeof SIDEBAR_VIEWS

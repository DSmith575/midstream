import { IconDashboard, IconListDetails, IconFolder } from '@tabler/icons-react'
import { UserView } from '@/components/dashboard/UserViewDashboard'
import { ApplicationView, SupportFolderView, UserUpcomingSupportViewDashboard } from '@/components/dashboard'

export const SIDEBAR_VIEWS = {
  user: {
    label: 'About Me',
    icon: IconDashboard,
    component: UserView,
  },
  application: {
    label: 'Get Support',
    icon: IconListDetails,
    component: ApplicationView,
  },
  supportFolder: {
    label: 'My Support Records',
    icon: IconFolder,
    component: SupportFolderView,
  },
  upcomingSupport: {
    label: 'Upcoming Support',
    icon: IconFolder,
    component: UserUpcomingSupportViewDashboard,
  }
}

export type SidebarViewKey = keyof typeof SIDEBAR_VIEWS

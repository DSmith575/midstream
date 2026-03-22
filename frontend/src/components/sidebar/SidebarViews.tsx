import { IconDashboard, IconListDetails, IconFolder } from '@tabler/icons-react'
import { UserView } from '@/components/dashboard/UserViewDashboard'
import { ApplicationView, SupportFolderView } from '@/components/dashboard'

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
  supportFolder: {
    label: 'Support Folder',
    icon: IconFolder,
    component: SupportFolderView,
  }
}

export type SidebarViewKey = keyof typeof SIDEBAR_VIEWS

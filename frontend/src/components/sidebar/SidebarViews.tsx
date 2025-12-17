import { UserView } from '@/components/dashboard/UserViewDashboard'
import { ApplicationView } from '@/components/dashboard/UserApplicationViewDashboard'

import {
  IconDashboard,
  IconListDetails,

} from "@tabler/icons-react"

export const SIDEBAR_VIEWS = {
  user: {
    label: "Profile",
    icon: IconDashboard,
    component: UserView, // note: not <UserView /> here
  },
  application: {
    label: "Applications",
    icon: IconListDetails,
    component: ApplicationView,
  }
}

export type SidebarViewKey = keyof typeof SIDEBAR_VIEWS
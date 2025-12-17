import * as React from 'react'
import { IconInnerShadowTop } from '@tabler/icons-react'

import { NavMain } from '@/components/sidebar/NavMain'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

import type { SidebarViewKey } from './SidebarViews'

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  userName: string
  current: SidebarViewKey
  onViewChange: (v: SidebarViewKey) => void
}

export const AppSidebar = ({
  current,
  onViewChange,
  userName,
  ...props
}: AppSidebarProps) => {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <div>
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold">{userName}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain current={current} onViewChange={onViewChange} />
      </SidebarContent>
    </Sidebar>
  )
}

import type { SidebarViewKey } from '@/components/sidebar/SidebarViews'
import { SIDEBAR_VIEWS } from '@/components/sidebar/SidebarViews'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

type NavMainProps = {
  current: SidebarViewKey
  onViewChange: (v: SidebarViewKey) => void
}

export const NavMain = ({ current, onViewChange }: NavMainProps) => {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {Object.entries(SIDEBAR_VIEWS).map(([key, item]) => {
            const Icon = item.icon
            const isActive = current === key

            return (
              <SidebarMenuItem key={key}>
                <SidebarMenuButton
                  tooltip={item.label}
                  className={`
                    ${isActive ? 'bg-(--color-primary) text-(--color-accent)' : ''}
                  `}
                  onClick={() => onViewChange(key as SidebarViewKey)}
                >
                  <Icon className="size-5" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

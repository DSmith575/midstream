import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { SignedIn, UserButton, useAuth } from '@clerk/clerk-react'
import { NavBarLogo } from '@/components/links/NavBarLogoLink'
import { LinkComponent } from '@/components/links/LinkComponent'
import {
  NavigationMenu,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'

import { routeConstants } from '@/lib/constants'
// import { postChangeUserRole } from '@/lib/api/devTools/postChangeUserRole'

// type UserRoles = 'CLIENT' | 'WORKER'
// // Testing
// const onClickSwitchUserRole = async (userId: string, role: UserRoles) => {
//   try {
//     const response = await postChangeUserRole({ userId, role })
//     if (response) {
//       console.log('User role switched successfully:', response)
//       window.location.reload()
//     } else {
//       console.error('Failed to switch user role')
//     }
//   } catch (error) {
//     console.error('Error switching user role:', error)
//   }
// }

export const Header = () => {
  const { userId } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <nav className="flex h-16 w-full items-center justify-between px-4 md:px-6">
        <NavBarLogo />

        <div className="flex items-center gap-4">
          {userId && (
            <div className="flex items-center gap-3 md:order-2 md:hidden">
              <SignedIn>
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: '!w-9 !h-9',
                    },
                  }}
                />
              </SignedIn>
            </div>
          )}

          <button
            className="rounded-md p-2 text-foreground transition-colors hover:bg-accent md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Nav */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="flex items-center gap-1">
            {!userId ? (
              <LinkComponent
                linkRef={routeConstants.login}
                linkName="Login/Sign Up"
              />
            ) : (
              <div className="flex items-center gap-4">
                <SignedIn>
                  <UserButton
                    appearance={{
                      elements: {
                        userButtonAvatarBox: '!w-9 !h-9',
                      },
                    }}
                  />
                </SignedIn>
                <LinkComponent
                  linkRef={routeConstants.dashboard}
                  linkName="Dashboard"
                />
              </div>
            )}

            <LinkComponent linkRef={routeConstants.home} linkName="Home" />

            <LinkComponent linkRef={routeConstants.about} linkName="About" />
          </NavigationMenuList>
        </NavigationMenu>
      </nav>

      {/* Mobile Menu Drawer */}
      {open && (
        <div className="border-t border-border/50 bg-card/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-card/60 md:hidden">
          <div className="flex flex-col gap-4">
            {!userId ? (
              <LinkComponent linkRef={routeConstants.login} linkName="Login" />
            ) : (
              <>
                <LinkComponent
                  linkRef={routeConstants.dashboard}
                  linkName="Dashboard"
                  onClick={() => setOpen(false)}
                />
              </>
            )}
            <LinkComponent
              linkRef={routeConstants.home}
              linkName="Home"
              onClick={() => setOpen(false)}
            />
            <LinkComponent
              linkRef={routeConstants.features}
              linkName="Features"
              onClick={() => setOpen(false)}
            />
            <LinkComponent
              linkRef={routeConstants.about}
              linkName="About"
              onClick={() => setOpen(false)}
            />
          </div>
        </div>
      )}
    </header>
  )
}

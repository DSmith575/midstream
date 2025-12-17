import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { SignedIn, UserButton, useAuth } from '@clerk/clerk-react'
import { NavBarLogo } from '@/components/links/NavBarLogoLink'
import { LinkComponent } from '@/components/links/LinkComponent'
import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'

// import { postChangeUserRole } from '@/lib/api/devTools/postChangeUserRole'

// type UserRoles = 'CLIENT' | 'WORKER'
// Testing
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
    <header className=" bg-white flex h-20 shrink-0 items-center px-4 shadow-md md:px-6">
      <nav className="flex w-full items-center justify-between">
        <NavBarLogo />

        <div className={'flex items-center gap-4'}>
          {userId && (
            <div className="flex items-center gap-3 md:order-2 md:hidden">
              <SignedIn>
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: '!w-10 !h-10',
                    },
                  }}
                />
              </SignedIn>
            </div>
          )}

          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Nav */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="flex gap-4 items-center">
            <NavigationMenuLink>
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
                          userButtonAvatarBox: '!w-10 !h-10',
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
            </NavigationMenuLink>

            <NavigationMenuLink>
              <LinkComponent linkRef={routeConstants.home} linkName="Home" />
            </NavigationMenuLink>

            <NavigationMenuLink>
              <LinkComponent linkRef={routeConstants.about} linkName="About" />
            </NavigationMenuLink>
          </NavigationMenuList>
        </NavigationMenu>
      </nav>

      {/* Mobile Menu Drawer */}
      {open && (
        <div className="z-20 fixed top-20 left-0 w-full bg-white shadow-md flex flex-col p-6 gap-6 md:hidden">
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
      )}
    </header>
  )
}

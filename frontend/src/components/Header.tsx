import { Menu } from 'lucide-react'
import { SignedIn, UserButton, useAuth } from '@clerk/clerk-react'
import { NavBarLogo } from '@/components/links/NavBarLogoLink'
import { LinkComponent } from '@/components/links/LinkComponent'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

import { DialogTitle } from '@/components/ui/dialog'
import { routeConstants } from '@/lib/constants'

export const Header = () => {
  const { userId } = useAuth()
  return (
    <header className="bg-white flex h-20 w-full shrink-0 items-center px-4 shadow-md md:px-6">
      <Sheet>
        <SheetContent side="right">
          <DialogTitle className={'sr-only'}>Menu</DialogTitle>
          <SheetDescription className={'sr-only'}>
            Navigation Menu
          </SheetDescription>
          <NavBarLogo />
          <section className={'flex h-full flex-col'}>
            <div className={'my-8 flex items-center justify-center'}>
              {!userId ? (
                <div className={'w-full flex justify-center shadow-sm'}>
                  <LinkComponent
                    linkRef={routeConstants.login}
                    linkName={'Login'}
                  />
                </div>
              ) : (
                <LinkComponent
                  linkRef={routeConstants.dashboard}
                  linkName="Dashboard"
                />
              )}
            </div>

            <LinkComponent linkRef={routeConstants.home} linkName={'Home'} />
            <LinkComponent
              linkRef={routeConstants.features}
              linkName={'Features'}
            />
            <LinkComponent linkRef={routeConstants.about} linkName={'About'} />
          </section>
        </SheetContent>

        <nav className="flex w-full items-center justify-between">
          <NavBarLogo />
          <section className={'flex gap-4 items-center'}>
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: '!w-10 !h-10',
                  },
                }}
              />
            </SignedIn>
            <SheetTrigger asChild>
              <Button variant="outline" size="lg">
                <Menu />
              </Button>
            </SheetTrigger>
          </section>
        </nav>
      </Sheet>
    </header>
  )
}

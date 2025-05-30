import NavBarLogo from '@/components/links/NavBarLogoLink'
import LinkComponent from '@/components/links/LinkComponent'
import { Menu } from 'lucide-react'
import { SignedIn, useAuth, UserButton } from '@clerk/clerk-react'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetDescription,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

import { DialogTitle } from '@/components/ui/dialog'

const Header = () => {
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
                  <LinkComponent linkRef={'/login'} linkName={'Login'} />
                </div>
              ) : (
                <LinkComponent linkRef="/dashboard" linkName="Dashboard" />
              )}
            </div>

            <LinkComponent linkRef={'/'} linkName={'Home'} />
            <LinkComponent linkRef={'/features'} linkName={'Features'} />
            <LinkComponent linkRef={'/about'} linkName={'About'} />
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

export default Header

import logo from '/cccoil.svg'
import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { routeConstants } from '@/lib/constants'

export const NavBarLogo = () => {
  return (
    <>
      <Link
        to={routeConstants.home}
        className={'flex items-center justify-center'}
      >
        <img src={logo} alt="logo" className={cn('h-16 w-16')} />
        <p className={cn('font-bold text-inherit ')}>
          MID<span className={cn('text-[#3659B1]')}>STREAM</span>
        </p>
      </Link>
    </>
  )
}

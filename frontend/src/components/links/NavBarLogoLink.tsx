import logo from '/cccoil.svg'
import { cn } from '@/lib/utils'
import { Link } from '@tanstack/react-router'

const NavBarLogo = () => {
  return (
    <>
      <Link to={'/'} className={'flex items-center justify-center'}>
        <img src={logo} alt="logo" className={cn('h-16 w-16')} />
        <p className={cn('font-bold text-inherit')}>
          MID<span className={cn('text-[#3659B1]')}>STREAM</span>
        </p>
      </Link>
    </>
  )
}

export { NavBarLogo }

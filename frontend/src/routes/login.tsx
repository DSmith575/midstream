import { SignIn } from '@clerk/clerk-react'
import { createFileRoute } from '@tanstack/react-router'
import { routeConstants } from '@/lib/constants'

const RouteComponent = () => {
  return (
    <main className={'flex min-h-[50vh] w-full items-center justify-center'}>
      <SignIn signUpUrl={routeConstants.signup} />
    </main>
  )
}

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

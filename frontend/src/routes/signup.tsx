import { createFileRoute } from '@tanstack/react-router'
import { SignUp } from '@clerk/clerk-react'



const RouteComponent = () => {
  return (
    <main className={'flex min-h-[50vh] w-full items-center justify-center'}>
      <SignUp
        signInUrl="/login"
      />
    </main>
  )
}

export const Route = createFileRoute('/signup')({
  component: RouteComponent,
})
import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '@clerk/clerk-react'
import { Suspense } from 'react';
import Spinner from '@/components/spinner/Spinner';
import DashboardContent from '@/components/dashboard/DashboardContent';


const RouteComponent = () => {
  const { isLoaded, userId, orgRole } = useAuth();

  if (!isLoaded || !userId) return null;

  return (
    <Suspense fallback={<div className={'mt-12 flex justify-center'}><Spinner/></div>}>
        <DashboardContent userId={userId} />
    </Suspense>
  )
}

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
})
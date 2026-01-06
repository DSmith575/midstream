import { useUserProfile } from '@/hooks/userProfile/useUserProfile'
import { UserProfileCard } from '@/components/profile/card/userCard/UserProfileCard'
import { Spinner } from '@/components/spinner'

export const UserView = ({ userId }: { userId: string }) => {
  const { userData, error, isLoading } = useUserProfile(userId)

  if (isLoading) return <Spinner/>
  if (error) return <p>Error loading user.</p>

  if (!userData) return <p>No user data found.</p>

  return <UserProfileCard userProfile={userData} />
}

import type { UserProfileProps } from '@/lib/interfaces'

const apiKey = import.meta.env.VITE_API_BACKEND_URL

export const fetchUserProfile = async (
  userId: string,
  token: string,
): Promise<UserProfileProps | null> => {
  try {
    const response = await fetch(
      `${apiKey}userProfiles/getUserProfile?googleId=${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      },
    )

    if (!response.ok) {
      // User hasn't created a profile yet - return null instead of throwing
      if (response.status === 404) {
        return null
      }
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to fetch user profile')
    }

    const data = await response.json()

    return data.user
  } catch (error) {
    console.log(error)
    return null
  }
}

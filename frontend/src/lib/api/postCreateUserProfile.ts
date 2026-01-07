import type { CreateUserProps } from '@/lib/interfaces'

const apiKey = import.meta.env.VITE_API_BACKEND_URL

export const postUserProfile = async (
  userData: CreateUserProps,
  token: string,
) => {
  try {
    const response = await fetch(`${apiKey}userProfiles/createUserProfile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to create user profile')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(error)
    throw error
  }
}

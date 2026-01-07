import type { CreateReferralProps } from '@/lib/interfaces'

const apiKey = import.meta.env.VITE_API_BACKEND_URL

export const postReferralForm = async (
  referralData: CreateReferralProps,
  token: string,
) => {
  try {
    const response = await fetch(`${apiKey}referralForms/createReferralForm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(referralData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to create referral form')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(error)
    throw error
  }
}

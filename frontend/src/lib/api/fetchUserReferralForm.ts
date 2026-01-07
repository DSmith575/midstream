const apiKey = import.meta.env.VITE_API_BACKEND_URL

export const fetchUserReferralForm = async (
  googleId: string,
  token: string,
) => {
  try {
    const response = await fetch(
      `${apiKey}referralForms/user/getReferralForm/${encodeURIComponent(googleId)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )

    if (response.status === 404) {
      // No referral forms exist - return empty array
      return { data: [] }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to fetch referral forms')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(error)
    // Return empty array on any error to allow fallback UI
    return { data: [] }
  }
}

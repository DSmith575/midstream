const apiKey = import.meta.env.VITE_API_BACKEND_URL

export const fetchCompanyReferrals = async (companyId: number) => {
  try {
    const response = await fetch(
      `${apiKey}referralForms/getAllReferralForms/${companyId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    if (!response.ok) {
      throw new Error('Failed to fetch referral form')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(error)
    return null
  }
}

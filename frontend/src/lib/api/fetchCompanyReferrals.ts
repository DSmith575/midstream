const apiKey = import.meta.env.VITE_API_BACKEND_URL

export const fetchCompanyReferrals = async (
  companyId: number,
  queryParams: { assignedWorkerId?: string },
) => {
  try {
    const query = new URLSearchParams(
      queryParams?.assignedWorkerId ? queryParams : {},
    )
    const response = await fetch(
      `${apiKey}referralForms/getAllReferralForms/${companyId}?${query}`,
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

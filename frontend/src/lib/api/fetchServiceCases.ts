const apiKey = import.meta.env.VITE_API_BACKEND_URL

export const fetchServiceCases = async (queryParams: { caseWorkerId?: string, serviceCaseId?: string }) => {
  try {
    const query = new URLSearchParams(queryParams);
    const response = await fetch(
      `${apiKey}serviceCase/getServiceCase?${query}`,
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
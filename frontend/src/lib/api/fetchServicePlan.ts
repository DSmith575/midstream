const apiKey = import.meta.env.VITE_API_BACKEND_URL

export const fetchServicePlan = async (servicePlanId: string) => {
  try {
    const response = await fetch(
      `${apiKey}servicePlan/getServicePlan/${servicePlanId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    if (!response.ok) {
      throw new Error('Failed to fetch service plan')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(error)
    return null
  }
}

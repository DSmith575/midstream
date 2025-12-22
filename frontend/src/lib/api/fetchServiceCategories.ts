const apiKey = import.meta.env.VITE_API_BACKEND_URL

export const fetchServiceCategories = async () => {
  try {
    const response = await fetch(`${apiKey}servicePlan/getServiceCategories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch service categories')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(error)
    return null
  }
}

import type { CreateServicePlanEntryProps } from '@/lib/interfaces'

const apiKey = import.meta.env.VITE_API_BACKEND_URL

export const postServicePlanEntry = async (servicePlanEntryData: CreateServicePlanEntryProps) => {
  try {
    const response = await fetch(`${apiKey}servicePlan/createServicePlanEntry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(servicePlanEntryData),
    })

    if (!response.ok) {
      throw new Error('Failed to create service plan entry')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(error)
  }
}

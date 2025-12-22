import type { CreateServicePlanProps } from '@/lib/interfaces'

const apiKey = import.meta.env.VITE_API_BACKEND_URL

export const postServicePlan = async (
  servicePlanData: CreateServicePlanProps,
) => {
  try {
    const response = await fetch(`${apiKey}servicePlan/createServicePlan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(servicePlanData),
    })

    if (!response.ok) {
      throw new Error('Failed to create service plan')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(error)
  }
}

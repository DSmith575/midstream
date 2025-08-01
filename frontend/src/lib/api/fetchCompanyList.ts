import type { CompanyProps } from '@/lib/interfaces'

const apiKey = import.meta.env.VITE_API_BACKEND_URL

export const fetchCompanyList = async () => {
  try {
    const response = await fetch(`${apiKey}company/getCompanyList`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch company list')
    }

    const data: Array<CompanyProps> = await response.json()
    return data
  } catch (error) {
    console.log('Error fetching company list:', error)
    return []
  }
}

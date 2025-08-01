const apiKey = import.meta.env.VITE_API_BACKEND_URL

export const postJoinCompany = async (companyId: number, userId: string) => {
  // console.log("attempting to join company", companyId);
  try {
    const response = await fetch(`${apiKey}company/joinCompany`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ companyId: companyId, userId: userId }),
    })

    if (!response.ok) {
      throw new Error('Failed to join company')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error joining company:', error)
    return []
  }
}

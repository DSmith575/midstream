const apiKey = import.meta.env.VITE_API_BACKEND_URL

export const createReferralNote = async (
  referralId: string,
  content: string,
): Promise<any> => {
  console.log(`${apiKey}referralForms/notes/${referralId}`)
  const response = await fetch(`${apiKey}referralForms/notes/${referralId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to create note')
  }

  return response.json()
}

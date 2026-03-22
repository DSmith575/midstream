const apiKey = import.meta.env.VITE_API_BACKEND_URL

export const postSupportFolderTextItem = async (
  googleId: string,
  payload: { name: string; content: string },
  token: string,
) => {
  const response = await fetch(
    `${apiKey}support-folder/${encodeURIComponent(googleId)}/text`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    },
  )

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || 'Failed to create text file')
  }

  return response.json()
}

const apiKey = import.meta.env.VITE_API_BACKEND_URL

export const deleteSupportFolderItem = async (
  googleId: string,
  itemId: string,
  token: string,
) => {
  const response = await fetch(
    `${apiKey}support-folder/${encodeURIComponent(googleId)}/items/${encodeURIComponent(itemId)}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || 'Failed to delete support folder item')
  }

  return response.json()
}

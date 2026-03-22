const apiKey = import.meta.env.VITE_API_BACKEND_URL

export const downloadSupportFolderItem = async (
  googleId: string,
  itemId: string,
  token: string,
): Promise<Blob> => {
  const response = await fetch(
    `${apiKey}support-folder/${encodeURIComponent(googleId)}/items/${encodeURIComponent(itemId)}/download`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || 'Failed to download support folder item')
  }

  return response.blob()
}

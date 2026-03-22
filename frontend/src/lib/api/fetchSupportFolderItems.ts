const apiKey = import.meta.env.VITE_API_BACKEND_URL

export interface SupportFolderItem {
  id: string
  name: string
  type: 'FILE' | 'AUDIO' | 'TEXT'
  mimeType: string | null
  sizeBytes: number | null
  content: string | null
  createdAt: string
  updatedAt: string
}

export const fetchSupportFolderItems = async (
  googleId: string,
  token: string,
): Promise<{ data: SupportFolderItem[] }> => {
  const response = await fetch(
    `${apiKey}support-folder/${encodeURIComponent(googleId)}/items`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  )

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      errorData.message || 'Failed to fetch support folder items',
    )
  }

  return response.json()
}

const apiKey = import.meta.env.VITE_API_BACKEND_URL

export const postSupportFolderUpload = async (
  googleId: string,
  file: File,
  token: string,
) => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(
    `${apiKey}support-folder/${encodeURIComponent(googleId)}/upload`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    },
  )

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || 'Failed to upload file')
  }

  return response.json()
}

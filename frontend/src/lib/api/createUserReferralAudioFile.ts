const pythonApiKey = import.meta.env.VITE_PYTHON_API_URL

export const createUserReferralAudio = async (
  file: File,
  referralId: string,
) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('referralId', referralId)

  try {
    const response = await fetch(`${pythonApiKey}upload-audio`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      console.error('Upload failed:', errorData || response.statusText)
      throw new Error(errorData?.detail || 'Failed to upload audio')
    }

    return response.json()
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error('An unexpected error occurred')
  }
}

const pythonApiKey = import.meta.env.VITE_PYTHON_API_URL

export const createUserReferralAudio = async (file: File, referralId: string) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('referralId', referralId)

  const response = await fetch(`${pythonApiKey}upload-audio`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Failed to upload audio')
  }

  return response.json()
}

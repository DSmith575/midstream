const apiKey = import.meta.env.VITE_API_BACKEND_URL

export const generateReferralPdf = async (formId: string, token: string) => {
  const response = await fetch(
    `${apiKey}referralForms/generateFullReferralForm`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ referralFormId: formId }),
    },
  )

  if (!response.ok) {
    const message = await response.text().catch(() => '')
    throw new Error(message || `Request failed with status ${response.status}`)
  }

  return response.blob()
}

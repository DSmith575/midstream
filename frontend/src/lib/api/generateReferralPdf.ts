const apiKey = import.meta.env.VITE_API_BACKEND_URL

interface GeneratedReferralPdf {
  blob: Blob
  fileName: string
}

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

  const blob = await response.blob()
  const contentDisposition = response.headers.get('Content-Disposition') ?? ''
  const fileNameMatch = /filename="?([^\"]+)"?/i.exec(contentDisposition)
  const fileName = fileNameMatch?.[1] || `${formId}-referral.pdf`

  return { blob, fileName } satisfies GeneratedReferralPdf
}

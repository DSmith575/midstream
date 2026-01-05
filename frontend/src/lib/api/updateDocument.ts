const apiKey = import.meta.env.VITE_API_BACKEND_URL

export const updateDocumentTranscribedContent = async (
  documentId: string,
  transcribedContent: string,
): Promise<any> => {
  const response = await fetch(
    `${apiKey}referral-documents/document/${documentId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ transcribedContent }),
    },
  )

  if (!response.ok) {
    throw new Error('Failed to update document')
  }

  return response.json()
}

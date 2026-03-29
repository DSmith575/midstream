const apiKey = import.meta.env.VITE_API_BACKEND_URL

export const patchUpcomingSupportDismissStatus = async (
  googleId: string,
  notificationId: string,
  isDismissed: boolean,
  token: string,
) => {
  const response = await fetch(
    `${apiKey}support-folder/${encodeURIComponent(googleId)}/upcoming-support/${encodeURIComponent(notificationId)}/dismiss`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isDismissed }),
    },
  )

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || 'Failed to update dismiss status')
  }

  return response.json()
}

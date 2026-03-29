const apiKey = import.meta.env.VITE_API_BACKEND_URL

export const patchUpcomingSupportReadStatus = async (
  googleId: string,
  notificationId: string,
  isRead: boolean,
  token: string,
) => {
  const response = await fetch(
    `${apiKey}support-folder/${encodeURIComponent(googleId)}/upcoming-support/${encodeURIComponent(notificationId)}/read`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isRead }),
    },
  )

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || 'Failed to update read status')
  }

  return response.json()
}

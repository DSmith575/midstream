const apiKey = import.meta.env.VITE_API_BACKEND_URL

export const patchUpcomingSupportMoveToUpcoming = async (
  googleId: string,
  notificationId: string,
  token: string,
) => {
  const response = await fetch(
    `${apiKey}support-folder/${encodeURIComponent(googleId)}/upcoming-support/${encodeURIComponent(notificationId)}/move-to-upcoming`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  )

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || 'Failed to move notification to upcoming')
  }

  return response.json()
}

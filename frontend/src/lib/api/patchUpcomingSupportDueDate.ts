const apiKey = import.meta.env.VITE_API_BACKEND_URL

export const patchUpcomingSupportDueDate = async (
  googleId: string,
  notificationId: string,
  dueDateISO: string,
  token: string,
) => {
  const response = await fetch(
    `${apiKey}support-folder/${encodeURIComponent(googleId)}/upcoming-support/${encodeURIComponent(notificationId)}/due-date`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ dueDateISO }),
    },
  )

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || 'Failed to update due date')
  }

  return response.json()
}

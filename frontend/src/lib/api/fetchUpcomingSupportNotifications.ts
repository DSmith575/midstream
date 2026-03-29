const apiKey = import.meta.env.VITE_API_BACKEND_URL

export interface UpcomingSupportNotification {
  id: string
  title: string
  summary: string
  dueDateISO: string | null
  urgency: 'LOW' | 'MEDIUM' | 'HIGH'
  confidence: number
  sourceItemId: string | null
  sourceItemName: string | null
  reason: string
  isRead: boolean
  isDismissed: boolean
  scannedAt: string
  createdAt: string
  updatedAt: string
}

export interface UpcomingSupportResponse {
  data: UpcomingSupportNotification[]
  pastData: UpcomingSupportNotification[]
  scannedItems: number
  skippedItems: number
  persistedCount: number
}

export const fetchUpcomingSupportNotifications = async (
  googleId: string,
  token: string,
  options?: { rescan?: boolean },
): Promise<UpcomingSupportResponse> => {
  const query = options?.rescan ? '?rescan=true' : ''
  const response = await fetch(
    `${apiKey}support-folder/${encodeURIComponent(googleId)}/upcoming-support${query}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  )

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      errorData.message ||
        'Failed to generate upcoming support notifications',
    )
  }

  const payload = await response.json()
  return {
    data: Array.isArray(payload?.data) ? payload.data : [],
    pastData: Array.isArray(payload?.pastData) ? payload.pastData : [],
    scannedItems:
      typeof payload?.scannedItems === 'number' ? payload.scannedItems : 0,
    skippedItems:
      typeof payload?.skippedItems === 'number' ? payload.skippedItems : 0,
    persistedCount:
      typeof payload?.persistedCount === 'number' ? payload.persistedCount : 0,
  }
}

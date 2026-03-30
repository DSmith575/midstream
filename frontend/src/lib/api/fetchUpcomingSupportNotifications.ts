import { requestUpcomingSupport } from './upcomingSupportClient'

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
  const suffix = options?.rescan ? '?rescan=true' : ''
  const payload = await requestUpcomingSupport<Record<string, unknown>>({
    googleId,
    token,
    suffix,
    errorMessage: 'Failed to generate upcoming support notifications',
  })
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

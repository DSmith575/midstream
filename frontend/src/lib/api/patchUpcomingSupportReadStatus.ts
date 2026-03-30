import { requestUpcomingSupport } from './upcomingSupportClient'

export const patchUpcomingSupportReadStatus = async (
  googleId: string,
  notificationId: string,
  isRead: boolean,
  token: string,
) => {
  return requestUpcomingSupport({
    googleId,
    token,
    method: 'PATCH',
    suffix: `/${encodeURIComponent(notificationId)}/read`,
    body: { isRead },
    errorMessage: 'Failed to update read status',
  })
}

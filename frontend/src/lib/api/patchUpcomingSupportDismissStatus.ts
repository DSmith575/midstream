import { requestUpcomingSupport } from './upcomingSupportClient'

export const patchUpcomingSupportDismissStatus = async (
  googleId: string,
  notificationId: string,
  isDismissed: boolean,
  token: string,
) => {
  return requestUpcomingSupport({
    googleId,
    token,
    method: 'PATCH',
    suffix: `/${encodeURIComponent(notificationId)}/dismiss`,
    body: { isDismissed },
    errorMessage: 'Failed to update dismiss status',
  })
}

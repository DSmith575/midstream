import { requestUpcomingSupport } from './upcomingSupportClient'

export const patchUpcomingSupportMoveToUpcoming = async (
  googleId: string,
  notificationId: string,
  token: string,
) => {
  return requestUpcomingSupport({
    googleId,
    token,
    method: 'PATCH',
    suffix: `/${encodeURIComponent(notificationId)}/move-to-upcoming`,
    errorMessage: 'Failed to move notification to upcoming',
  })
}

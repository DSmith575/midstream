import { requestUpcomingSupport } from './upcomingSupportClient'

export const patchUpcomingSupportDueDate = async (
  googleId: string,
  notificationId: string,
  dueDateISO: string,
  token: string,
) => {
  return requestUpcomingSupport({
    googleId,
    token,
    method: 'PATCH',
    suffix: `/${encodeURIComponent(notificationId)}/due-date`,
    body: { dueDateISO },
    errorMessage: 'Failed to update due date',
  })
}

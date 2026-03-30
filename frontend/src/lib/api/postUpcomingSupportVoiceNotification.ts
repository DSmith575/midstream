import { requestUpcomingSupport } from './upcomingSupportClient'

export const postUpcomingSupportVoiceNotification = async (
  googleId: string,
  transcript: string,
  token: string,
) => {
  return requestUpcomingSupport({
    googleId,
    token,
    method: 'POST',
    suffix: '/voice',
    body: { transcript },
    errorMessage: 'Failed to create appointment from voice input',
  })
}

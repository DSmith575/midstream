import { requestSupportFolderJson } from './supportFolderClient'

export const postSupportFolderTextItem = async (
  googleId: string,
  payload: { name: string; content: string },
  token: string,
) => {
  return requestSupportFolderJson({
    googleId,
    token,
    method: 'POST',
    suffix: '/text',
    body: JSON.stringify(payload),
    errorMessage: 'Failed to create text file',
  })
}

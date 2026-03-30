import { requestSupportFolderJson } from './supportFolderClient'

export const deleteSupportFolderItem = async (
  googleId: string,
  itemId: string,
  token: string,
) => {
  return requestSupportFolderJson({
    googleId,
    token,
    method: 'DELETE',
    suffix: `/items/${encodeURIComponent(itemId)}`,
    includeJsonContentType: false,
    errorMessage: 'Failed to delete support folder item',
  })
}

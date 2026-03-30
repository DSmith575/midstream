import { requestSupportFolderBlob } from './supportFolderClient'

export const downloadSupportFolderItem = async (
  googleId: string,
  itemId: string,
  token: string,
): Promise<Blob> => {
  return requestSupportFolderBlob({
    googleId,
    token,
    suffix: `/items/${encodeURIComponent(itemId)}/download`,
    errorMessage: 'Failed to download support folder item',
  })
}

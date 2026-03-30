import { requestSupportFolderJson } from './supportFolderClient'

export interface SupportFolderItem {
  id: string
  name: string
  type: 'FILE' | 'AUDIO' | 'TEXT'
  mimeType: string | null
  sizeBytes: number | null
  content: string | null
  createdAt: string
  updatedAt: string
}

export const fetchSupportFolderItems = async (
  googleId: string,
  token: string,
): Promise<{ data: SupportFolderItem[] }> => {
  return requestSupportFolderJson({
    googleId,
    token,
    suffix: '/items',
    errorMessage: 'Failed to fetch support folder items',
  })
}

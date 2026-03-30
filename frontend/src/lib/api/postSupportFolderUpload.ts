import { requestSupportFolderJson } from './supportFolderClient'

export const postSupportFolderUpload = async (
  googleId: string,
  file: File,
  token: string,
) => {
  const formData = new FormData()
  formData.append('file', file)

  return requestSupportFolderJson({
    googleId,
    token,
    method: 'POST',
    suffix: '/upload',
    body: formData,
    includeJsonContentType: false,
    errorMessage: 'Failed to upload file',
  })
}

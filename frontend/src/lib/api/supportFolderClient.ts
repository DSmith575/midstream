const apiBaseUrl = import.meta.env.VITE_API_BACKEND_URL

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE'

const parseErrorMessage = async (response: Response, fallbackMessage: string) => {
  const errorData = await response.json().catch(() => ({}))
  return errorData?.message || fallbackMessage
}

export const buildSupportFolderPath = (googleId: string, suffix = '') => {
  const encodedGoogleId = encodeURIComponent(googleId)
  return `${apiBaseUrl}support-folder/${encodedGoogleId}${suffix}`
}

export const requestSupportFolderJson = async <T>(params: {
  googleId: string
  token: string
  method?: HttpMethod
  suffix?: string
  body?: BodyInit | null
  includeJsonContentType?: boolean
  errorMessage: string
}): Promise<T> => {
  const {
    googleId,
    token,
    method = 'GET',
    suffix = '',
    body,
    includeJsonContentType = true,
    errorMessage,
  } = params

  const response = await fetch(buildSupportFolderPath(googleId, suffix), {
    method,
    headers: {
      ...(includeJsonContentType ? { 'Content-Type': 'application/json' } : {}),
      Authorization: `Bearer ${token}`,
    },
    ...(body !== undefined ? { body } : {}),
  })

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response, errorMessage))
  }

  return response.json() as Promise<T>
}

export const requestSupportFolderBlob = async (params: {
  googleId: string
  token: string
  suffix: string
  errorMessage: string
}): Promise<Blob> => {
  const { googleId, token, suffix, errorMessage } = params

  const response = await fetch(buildSupportFolderPath(googleId, suffix), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response, errorMessage))
  }

  return response.blob()
}
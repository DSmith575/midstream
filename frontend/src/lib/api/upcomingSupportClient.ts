const apiBaseUrl = import.meta.env.VITE_API_BACKEND_URL

type HttpMethod = 'GET' | 'PATCH'

const getErrorMessage = async (response: Response, fallbackMessage: string) => {
  const errorData = await response.json().catch(() => ({}))
  return errorData?.message || fallbackMessage
}

export const buildUpcomingSupportPath = (googleId: string, suffix = '') => {
  const encodedGoogleId = encodeURIComponent(googleId)
  return `${apiBaseUrl}support-folder/${encodedGoogleId}/upcoming-support${suffix}`
}

export const requestUpcomingSupport = async <T>(params: {
  googleId: string
  token: string
  method?: HttpMethod
  suffix?: string
  body?: unknown
  errorMessage: string
}): Promise<T> => {
  const {
    googleId,
    token,
    method = 'GET',
    suffix = '',
    body,
    errorMessage,
  } = params

  const response = await fetch(buildUpcomingSupportPath(googleId, suffix), {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  })

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, errorMessage))
  }

  return response.json() as Promise<T>
}

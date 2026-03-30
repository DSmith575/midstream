import { afterEach, describe, expect, it, vi } from 'vitest'

import { buildUpcomingSupportPath, requestUpcomingSupport } from '@/lib/api/upcomingSupportClient'

const createJsonResponse = (options: {
  ok: boolean
  jsonData?: unknown
  status?: number
}) => {
  const { ok, jsonData = {}, status = ok ? 200 : 400 } = options
  return {
    ok,
    status,
    json: vi.fn().mockResolvedValue(jsonData),
  } as unknown as Response
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('upcomingSupportClient', () => {
  it('buildUpcomingSupportPath encodes google id and appends suffix', () => {
    const path = buildUpcomingSupportPath('abc 123', '?rescan=true')

    expect(path).toContain('support-folder/abc%20123/upcoming-support?rescan=true')
  })

  it('requestUpcomingSupport sends GET by default with auth headers', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      createJsonResponse({
        ok: true,
        jsonData: { data: [] },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    await requestUpcomingSupport<{ data: unknown[] }>({
      googleId: 'user-1',
      token: 'token-123',
      errorMessage: 'Failed',
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit]

    expect(url).toContain('support-folder/user-1/upcoming-support')
    expect(options.method).toBe('GET')
    expect(options.headers).toMatchObject({
      Authorization: 'Bearer token-123',
      'Content-Type': 'application/json',
    })
    expect(options.body).toBeUndefined()
  })

  it('requestUpcomingSupport serializes body for PATCH requests', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      createJsonResponse({
        ok: true,
        jsonData: { success: true },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    await requestUpcomingSupport<{ success: boolean }>({
      googleId: 'user-2',
      token: 'token-abc',
      method: 'PATCH',
      suffix: '/notification-1/read',
      body: { isRead: true },
      errorMessage: 'Failed to patch',
    })

    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(options.method).toBe('PATCH')
    expect(options.body).toBe(JSON.stringify({ isRead: true }))
  })

  it('requestUpcomingSupport uses backend message when request fails', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      createJsonResponse({
        ok: false,
        jsonData: { message: 'Backend rejected request' },
        status: 500,
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    await expect(
      requestUpcomingSupport({
        googleId: 'user-3',
        token: 'token-err',
        errorMessage: 'Fallback message',
      }),
    ).rejects.toThrow('Backend rejected request')
  })

  it('requestUpcomingSupport falls back to provided error message when no json payload is available', async () => {
    const badResponse = {
      ok: false,
      status: 500,
      json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
    } as unknown as Response

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(badResponse))

    await expect(
      requestUpcomingSupport({
        googleId: 'user-4',
        token: 'token-fallback',
        errorMessage: 'Fallback message',
      }),
    ).rejects.toThrow('Fallback message')
  })
})

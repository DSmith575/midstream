import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  buildSupportFolderPath,
  requestSupportFolderBlob,
  requestSupportFolderJson,
} from '@/lib/api/supportFolderClient'

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

describe('supportFolderClient', () => {
  it('buildSupportFolderPath encodes google id and appends suffix', () => {
    const path = buildSupportFolderPath('google id', '/items')

    expect(path).toContain('support-folder/google%20id/items')
  })

  it('requestSupportFolderJson sends JSON headers by default', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      createJsonResponse({
        ok: true,
        jsonData: { data: [] },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    await requestSupportFolderJson<{ data: unknown[] }>({
      googleId: 'g-1',
      token: 'token-1',
      suffix: '/items',
      errorMessage: 'Failed',
    })

    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(options.method).toBe('GET')
    expect(options.headers).toMatchObject({
      Authorization: 'Bearer token-1',
      'Content-Type': 'application/json',
    })
  })

  it('requestSupportFolderJson allows non-json content type for form uploads', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      createJsonResponse({
        ok: true,
        jsonData: { id: 'item-1' },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    const formData = new FormData()
    formData.append('file', new Blob(['x']), 'file.txt')

    await requestSupportFolderJson<{ id: string }>({
      googleId: 'g-2',
      token: 'token-2',
      method: 'POST',
      suffix: '/upload',
      body: formData,
      includeJsonContentType: false,
      errorMessage: 'Upload failed',
    })

    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(options.headers).toMatchObject({
      Authorization: 'Bearer token-2',
    })
    expect((options.headers as Record<string, string>)['Content-Type']).toBeUndefined()
    expect(options.body).toBe(formData)
  })

  it('requestSupportFolderBlob returns blob data on success', async () => {
    const expectedBlob = new Blob(['download'])
    const response = {
      ok: true,
      blob: vi.fn().mockResolvedValue(expectedBlob),
      json: vi.fn(),
    } as unknown as Response

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response))

    const result = await requestSupportFolderBlob({
      googleId: 'g-3',
      token: 'token-3',
      suffix: '/items/item-1/download',
      errorMessage: 'Download failed',
    })

    expect(result).toBe(expectedBlob)
  })

  it('requestSupportFolderBlob surfaces backend error messages', async () => {
    const response = {
      ok: false,
      json: vi.fn().mockResolvedValue({ message: 'File not found' }),
      blob: vi.fn(),
    } as unknown as Response

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response))

    await expect(
      requestSupportFolderBlob({
        googleId: 'g-4',
        token: 'token-4',
        suffix: '/items/missing/download',
        errorMessage: 'Download failed',
      }),
    ).rejects.toThrow('File not found')
  })
})

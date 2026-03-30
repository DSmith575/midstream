import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useSupportFolder } from '@/hooks/userProfile/useSupportFolder'
import { createTestQueryWrapper } from './testQueryWrapper'

const {
  mockGetToken,
  toastSuccess,
  toastError,
  fetchSupportFolderItemsMock,
  postSupportFolderUploadMock,
  postSupportFolderTextItemMock,
  deleteSupportFolderItemMock,
  downloadSupportFolderItemMock,
} = vi.hoisted(() => ({
  mockGetToken: vi.fn(),
  toastSuccess: vi.fn(),
  toastError: vi.fn(),
  fetchSupportFolderItemsMock: vi.fn(),
  postSupportFolderUploadMock: vi.fn(),
  postSupportFolderTextItemMock: vi.fn(),
  deleteSupportFolderItemMock: vi.fn(),
  downloadSupportFolderItemMock: vi.fn(),
}))

vi.mock('@clerk/clerk-react', () => ({
  useAuth: () => ({
    getToken: mockGetToken,
  }),
}))

vi.mock('sonner', () => ({
  toast: {
    success: toastSuccess,
    error: toastError,
  },
}))

vi.mock('@/lib/api/fetchSupportFolderItems', () => ({
  fetchSupportFolderItems: fetchSupportFolderItemsMock,
}))

vi.mock('@/lib/api/postSupportFolderUpload', () => ({
  postSupportFolderUpload: postSupportFolderUploadMock,
}))

vi.mock('@/lib/api/postSupportFolderTextItem', () => ({
  postSupportFolderTextItem: postSupportFolderTextItemMock,
}))

vi.mock('@/lib/api/deleteSupportFolderItem', () => ({
  deleteSupportFolderItem: deleteSupportFolderItemMock,
}))

vi.mock('@/lib/api/downloadSupportFolderItem', () => ({
  downloadSupportFolderItem: downloadSupportFolderItemMock,
}))

describe('useSupportFolder', () => {
  beforeEach(() => {
    mockGetToken.mockResolvedValue('token-123')
    fetchSupportFolderItemsMock.mockResolvedValue({ data: [] })
    postSupportFolderUploadMock.mockResolvedValue({})
    postSupportFolderTextItemMock.mockResolvedValue({})
    deleteSupportFolderItemMock.mockResolvedValue({})
    downloadSupportFolderItemMock.mockResolvedValue(new Blob(['data']))
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('loads support folder items from api', async () => {
    const item = {
      id: 'item-1',
      name: 'File.txt',
      type: 'FILE',
      mimeType: 'text/plain',
      sizeBytes: 10,
      content: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    fetchSupportFolderItemsMock.mockResolvedValueOnce({ data: [item] })

    const { wrapper } = createTestQueryWrapper()
    const { result } = renderHook(() => useSupportFolder('google-1'), { wrapper })

    await waitFor(() => {
      expect(result.current.items).toHaveLength(1)
    })

    expect(fetchSupportFolderItemsMock).toHaveBeenCalledWith('google-1', 'token-123')
  })

  it('uploads file and shows success toast', async () => {
    const { wrapper } = createTestQueryWrapper()
    const { result } = renderHook(() => useSupportFolder('google-1'), { wrapper })

    await waitFor(() => {
      expect(fetchSupportFolderItemsMock).toHaveBeenCalled()
    })

    await act(async () => {
      result.current.uploadFile(new File(['hello'], 'doc.txt', { type: 'text/plain' }))
    })

    await waitFor(() => {
      expect(postSupportFolderUploadMock).toHaveBeenCalled()
      expect(toastSuccess).toHaveBeenCalledWith('File uploaded to support folder')
    })
  })

  it('createText calls api with token', async () => {
    const { wrapper } = createTestQueryWrapper()
    const { result } = renderHook(() => useSupportFolder('google-1'), { wrapper })

    await waitFor(() => {
      expect(fetchSupportFolderItemsMock).toHaveBeenCalled()
    })

    await act(async () => {
      result.current.createText({ name: 'note.txt', content: 'hello world' })
    })

    await waitFor(() => {
      expect(postSupportFolderTextItemMock).toHaveBeenCalledWith(
        'google-1',
        { name: 'note.txt', content: 'hello world' },
        'token-123',
      )
    })
  })
})

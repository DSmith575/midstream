import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useUpcomingSupport } from '@/hooks/userProfile/useUpcomingSupport'
import { createTestQueryWrapper } from './testQueryWrapper'

const {
  mockGetToken,
  toastSuccess,
  toastError,
  fetchUpcomingSupportNotificationsMock,
  patchUpcomingSupportReadStatusMock,
  patchUpcomingSupportDismissStatusMock,
  patchUpcomingSupportMoveToUpcomingMock,
  patchUpcomingSupportDueDateMock,
} = vi.hoisted(() => ({
  mockGetToken: vi.fn(),
  toastSuccess: vi.fn(),
  toastError: vi.fn(),
  fetchUpcomingSupportNotificationsMock: vi.fn(),
  patchUpcomingSupportReadStatusMock: vi.fn(),
  patchUpcomingSupportDismissStatusMock: vi.fn(),
  patchUpcomingSupportMoveToUpcomingMock: vi.fn(),
  patchUpcomingSupportDueDateMock: vi.fn(),
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

vi.mock('@/lib/api/fetchUpcomingSupportNotifications', () => ({
  fetchUpcomingSupportNotifications: fetchUpcomingSupportNotificationsMock,
}))

vi.mock('@/lib/api/patchUpcomingSupportReadStatus', () => ({
  patchUpcomingSupportReadStatus: patchUpcomingSupportReadStatusMock,
}))

vi.mock('@/lib/api/patchUpcomingSupportDismissStatus', () => ({
  patchUpcomingSupportDismissStatus: patchUpcomingSupportDismissStatusMock,
}))

vi.mock('@/lib/api/patchUpcomingSupportMoveToUpcoming', () => ({
  patchUpcomingSupportMoveToUpcoming: patchUpcomingSupportMoveToUpcomingMock,
}))

vi.mock('@/lib/api/patchUpcomingSupportDueDate', () => ({
  patchUpcomingSupportDueDate: patchUpcomingSupportDueDateMock,
}))

describe('useUpcomingSupport', () => {
  beforeEach(() => {
    mockGetToken.mockResolvedValue('token-abc')
    fetchUpcomingSupportNotificationsMock.mockResolvedValue({
      data: [],
      pastData: [],
      scannedItems: 0,
      skippedItems: 0,
      persistedCount: 0,
    })
    patchUpcomingSupportReadStatusMock.mockResolvedValue({})
    patchUpcomingSupportDismissStatusMock.mockResolvedValue({})
    patchUpcomingSupportMoveToUpcomingMock.mockResolvedValue({})
    patchUpcomingSupportDueDateMock.mockResolvedValue({})
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('loads upcoming support notifications', async () => {
    const { wrapper } = createTestQueryWrapper()
    const { result } = renderHook(() => useUpcomingSupport('google-7'), { wrapper })

    await waitFor(() => {
      expect(result.current.data?.data).toEqual([])
    })

    expect(fetchUpcomingSupportNotificationsMock).toHaveBeenCalledWith('google-7', 'token-abc')
  })

  it('refreshScan triggers rescan api and success toast', async () => {
    const { wrapper } = createTestQueryWrapper()
    const { result } = renderHook(() => useUpcomingSupport('google-7'), { wrapper })

    await waitFor(() => {
      expect(fetchUpcomingSupportNotificationsMock).toHaveBeenCalled()
    })

    await act(async () => {
      result.current.refreshScan()
    })

    await waitFor(() => {
      expect(fetchUpcomingSupportNotificationsMock).toHaveBeenCalledWith('google-7', 'token-abc', { rescan: true })
      expect(toastSuccess).toHaveBeenCalledWith('Upcoming support scan completed')
    })
  })

  it('setDueDate sends patch request with token', async () => {
    const { wrapper } = createTestQueryWrapper()
    const { result } = renderHook(() => useUpcomingSupport('google-7'), { wrapper })

    await waitFor(() => {
      expect(fetchUpcomingSupportNotificationsMock).toHaveBeenCalled()
    })

    await act(async () => {
      result.current.setDueDate({
        notificationId: 'note-1',
        dueDateISO: '2026-05-01T10:00:00.000Z',
      })
    })

    await waitFor(() => {
      expect(patchUpcomingSupportDueDateMock).toHaveBeenCalledWith(
        'google-7',
        'note-1',
        '2026-05-01T10:00:00.000Z',
        'token-abc',
      )
      expect(toastSuccess).toHaveBeenCalledWith('Due date updated')
    })
  })
})

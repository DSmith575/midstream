import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { UpcomingSupportCard } from '@/components/profile/card/upcomingSupport/UpcomingSupportCard'

const useUpcomingSupportMock = vi.fn()

vi.mock('@/hooks/userProfile', () => ({
  useUpcomingSupport: (...args: unknown[]) => useUpcomingSupportMock(...args),
}))

describe('UpcomingSupportCard', () => {
  it('renders empty state when there is no data', () => {
    useUpcomingSupportMock.mockReturnValue({
      data: {
        data: [],
        pastData: [],
        scannedItems: 0,
        skippedItems: 0,
        persistedCount: 0,
      },
      isLoading: false,
      isFetching: false,
      error: null,
      refreshScan: vi.fn(),
      refreshScanPending: false,
      setReadStatus: vi.fn(),
      readStatusPending: false,
      setDismissStatus: vi.fn(),
      dismissStatusPending: false,
      moveToUpcoming: vi.fn(),
      moveToUpcomingPending: false,
      setDueDate: vi.fn(),
      dueDatePending: false,
    })

    render(<UpcomingSupportCard userId="user-1" />)

    expect(screen.getByText('No upcoming reminders found yet. Add letters or notes in your support folder and run a refresh scan.')).toBeTruthy()
  })

  it('renders reminder details including due date and source', () => {
    useUpcomingSupportMock.mockReturnValue({
      data: {
        data: [
          {
            id: 'id-1',
            title: 'Medical appointment',
            summary: 'Attend specialist visit',
            dueDateISO: '2026-04-10T14:30:00.000Z',
            urgency: 'HIGH',
            confidence: 0.95,
            sourceItemId: 'item-1',
            sourceItemName: 'record.png',
            reason: 'Matched DATE and TIME fields',
            isRead: false,
          },
        ],
        pastData: [],
        scannedItems: 1,
        skippedItems: 0,
        persistedCount: 1,
      },
      isLoading: false,
      isFetching: false,
      error: null,
      refreshScan: vi.fn(),
      refreshScanPending: false,
      setReadStatus: vi.fn(),
      readStatusPending: false,
      setDismissStatus: vi.fn(),
      dismissStatusPending: false,
      moveToUpcoming: vi.fn(),
      moveToUpcomingPending: false,
      setDueDate: vi.fn(),
      dueDatePending: false,
    })

    render(<UpcomingSupportCard userId="user-1" />)

    expect(screen.getByText('Medical appointment')).toBeTruthy()
    expect(screen.getByText('Source: record.png')).toBeTruthy()
    expect(screen.getByText(/Due:/)).toBeTruthy()
  })

  it('calls refreshScan when refresh button is clicked', async () => {
    const refreshScan = vi.fn()
    useUpcomingSupportMock.mockReturnValue({
      data: {
        data: [],
        pastData: [],
        scannedItems: 0,
        skippedItems: 0,
        persistedCount: 0,
      },
      isLoading: false,
      isFetching: false,
      error: null,
      refreshScan,
      refreshScanPending: false,
      setReadStatus: vi.fn(),
      readStatusPending: false,
      setDismissStatus: vi.fn(),
      dismissStatusPending: false,
      moveToUpcoming: vi.fn(),
      moveToUpcomingPending: false,
      setDueDate: vi.fn(),
      dueDatePending: false,
    })

    render(<UpcomingSupportCard userId="user-1" />)

    fireEvent.click(screen.getByRole('button', { name: /Refresh scan/i }))
    expect(refreshScan).toHaveBeenCalledTimes(1)
  })
})

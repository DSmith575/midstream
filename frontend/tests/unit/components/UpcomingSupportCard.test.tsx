import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { UpcomingSupportCard } from '@/components/profile/card/upcomingSupport/UpcomingSupportCard'

const useUpcomingSupportMock = vi.fn()

vi.mock('@/hooks/userProfile', () => ({
  useUpcomingSupport: (...args: unknown[]) => useUpcomingSupportMock(...args),
}))

const baseUpcomingSupportValue = {
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
  createVoiceAppointment: vi.fn(),
  createVoiceAppointmentPending: false,
}

describe('UpcomingSupportCard', () => {
  it('does not duplicate transcript text across interim and final speech events', async () => {
    const recognitionInstance = {
      continuous: false,
      interimResults: false,
      lang: 'en-NZ',
      onresult: null as ((event: any) => void) | null,
      onerror: null as (() => void) | null,
      onend: null as (() => void) | null,
      start: vi.fn(),
      stop: vi.fn(),
    }
    const speechCtor = vi.fn(() => recognitionInstance)
    const win = window as Window & { webkitSpeechRecognition?: unknown }
    const previousSpeechCtor = win.webkitSpeechRecognition
    win.webkitSpeechRecognition = speechCtor

    useUpcomingSupportMock.mockReturnValue(baseUpcomingSupportValue)

    render(<UpcomingSupportCard userId="user-1" />)

    expect(screen.getByRole('button', { name: /Start voice capture/i })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /Start voice capture/i }))
    expect(recognitionInstance.start).toHaveBeenCalledTimes(1)

    const makeResults = (entries: Array<{ transcript: string; isFinal: boolean }>) => {
      const results: any = {
        length: entries.length,
        item: (index: number) => results[index],
      }
      entries.forEach((entry, index) => {
        results[index] = {
          0: { transcript: entry.transcript },
          isFinal: entry.isFinal,
        }
      })
      return results
    }

    act(() => {
      recognitionInstance.onresult?.({
        resultIndex: 0,
        results: makeResults([
          { transcript: 'Doctors at 9:00 PM first of April', isFinal: false },
        ]),
      })
    })
    act(() => {
      recognitionInstance.onresult?.({
        resultIndex: 0,
        results: makeResults([
          { transcript: 'Doctors at 9:00 PM first of April', isFinal: true },
        ]),
      })
    })

    const draftInput = screen.getByPlaceholderText(
      'Example: Appointment with Dr Smith on 14 April at 2:30 PM at Auckland City Hospital.',
    ) as HTMLTextAreaElement
    await waitFor(() => {
      expect(draftInput.value).toBe('Doctors at 9:00 PM first of April')
    })

    if (previousSpeechCtor) {
      win.webkitSpeechRecognition = previousSpeechCtor
    } else {
      delete win.webkitSpeechRecognition
    }
  })

  it('creates appointment note from voice draft', () => {
    const createVoiceAppointment = vi.fn((_payload, options) => {
      options?.onSuccess?.()
    })
    useUpcomingSupportMock.mockReturnValue({
      ...baseUpcomingSupportValue,
      createVoiceAppointment,
    })

    render(<UpcomingSupportCard userId="user-1" />)

    fireEvent.change(
      screen.getByPlaceholderText(
        'Example: Appointment with Dr Smith on 14 April at 2:30 PM at Auckland City Hospital.',
      ),
      {
        target: {
          value: 'Appointment with GP on 10 April at 9 AM.',
        },
      },
    )

    fireEvent.click(screen.getByRole('button', { name: /Create appointment from voice note/i }))

    expect(createVoiceAppointment).toHaveBeenCalledWith(
      expect.objectContaining({
        transcript: 'Appointment with GP on 10 April at 9 AM.',
      }),
      expect.any(Object),
    )
    expect(screen.getByText('Saved directly to Upcoming Support notifications.')).toBeTruthy()
  })

  it('renders empty state when there is no data', () => {
    useUpcomingSupportMock.mockReturnValue(baseUpcomingSupportValue)

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
      createVoiceAppointment: vi.fn(),
      createVoiceAppointmentPending: false,
    })

    render(<UpcomingSupportCard userId="user-1" />)

    expect(screen.getByText('Medical appointment')).toBeTruthy()
    expect(screen.getByText('Source: record.png')).toBeTruthy()
    expect(screen.getByText(/Due:/)).toBeTruthy()
  })

  it('calls refreshScan when refresh button is clicked', async () => {
    const refreshScan = vi.fn()
    useUpcomingSupportMock.mockReturnValue({
      ...baseUpcomingSupportValue,
      refreshScan,
    })

    render(<UpcomingSupportCard userId="user-1" />)

    fireEvent.click(screen.getByRole('button', { name: /Refresh scan/i }))
    expect(refreshScan).toHaveBeenCalledTimes(1)
  })
})

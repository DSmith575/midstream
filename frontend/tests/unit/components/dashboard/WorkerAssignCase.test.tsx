import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { WorkerAssignCase } from '@/components/dashboard/WorkerAssignCase'

const { generateFormSectionsMock } = vi.hoisted(() => ({
  generateFormSectionsMock: vi.fn(),
}))

vi.mock('@/lib/functions/formFunctions', () => ({
  generateFormSections: (...args: unknown[]) => generateFormSectionsMock(...args),
}))

vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }: { children: React.ReactNode; open: boolean }) =>
    open ? <div data-testid="dialog-root">{children}</div> : null,
  DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogDescription: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogFooter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
}))

vi.mock('@/components/ui/accordion', () => ({
  Accordion: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AccordionItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AccordionTrigger: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
  AccordionContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
}))

vi.mock('@/components/ui/label', () => ({
  Label: ({ children }: { children: React.ReactNode }) => <label>{children}</label>,
}))

vi.mock('@/components/referralForms/ReferralStatusBadge', () => ({
  ReferralStatusBadge: ({ status }: { status: string }) => <div data-testid="status-badge">{status}</div>,
}))

vi.mock('@/components/referralForms/WorkerReferralFormClientView', () => ({
  WorkerReferralFormClientView: ({ refField }: { refField: string }) => (
    <div data-testid="ref-field">{refField}</div>
  ),
}))

describe('WorkerAssignCase', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('shows warning when case worker id is missing', () => {
    render(
      <WorkerAssignCase
        caseWorkerId=""
        referralForm={{}}
        setOpen={vi.fn()}
        open
      />,
    )

    expect(
      screen.getByText('You must be assigned a case worker to assign cases.'),
    ).toBeTruthy()
  })

  it('renders referral details and assigns worker on click', async () => {
    generateFormSectionsMock.mockReturnValue([
      { title: 'Personal Information', field: 'personalInformation' },
    ])

    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    const alertMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    vi.stubGlobal('alert', alertMock)

    render(
      <WorkerAssignCase
        caseWorkerId="worker-9"
        referralForm={{
          id: 'ref-1',
          status: 'PENDING',
          user: {
            personalInformation: { firstName: 'Jess', lastName: 'Taylor' },
          },
          assignedToWorker: null,
        }}
        setOpen={vi.fn()}
        open
      />,
    )

    expect(screen.getByText('Jess Taylor')).toBeTruthy()
    expect(screen.getByText('PENDING')).toBeTruthy()
    expect(screen.getByText('No worker assigned')).toBeTruthy()
    expect(screen.getByText('Personal Information')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Assign Self' }))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('assignCases/assignWorker'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ referralId: 'ref-1', caseWorkerId: 'worker-9' }),
        }),
      )
    })

    expect(alertMock).toHaveBeenCalledWith('Worker assigned successfully!')
  })
})

import { fireEvent, render, screen } from '@testing-library/react'
import type { ColumnDef } from '@tanstack/react-table'
import { describe, expect, it, vi } from 'vitest'

import { WorkerReferralTable } from '@/components/dashboard/WorkerNewReferralTable'

const { useGetAllCompanyReferralsMock } = vi.hoisted(() => ({
  useGetAllCompanyReferralsMock: vi.fn(),
}))

vi.mock('@/hooks/workerReferrals/useGetAllCompanyReferrals', () => ({
  useGetAllCompanyReferrals: (...args: unknown[]) => useGetAllCompanyReferralsMock(...args),
}))

vi.mock('@/components/spinner/Spinner', () => ({
  Spinner: () => <div data-testid="spinner">loading</div>,
}))

vi.mock('@/components/dashboard/WorkerAssignCase', () => ({
  WorkerAssignCase: ({ referralForm }: { referralForm: { id: string } }) => (
    <div data-testid="worker-assign-case">assign:{referralForm.id}</div>
  ),
}))

type ReferralRow = {
  id: string
  name: string
}

const columns: Array<ColumnDef<ReferralRow>> = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: (info) => info.getValue(),
  },
]

describe('WorkerReferralTable', () => {
  it('requires case worker assignment before rendering table', () => {
    useGetAllCompanyReferralsMock.mockReturnValue({
      isLoading: false,
      referrals: [],
    })

    render(
      <WorkerReferralTable caseWorkerId="" companyId={4} columns={columns} />,
    )

    expect(
      screen.getByText('You must be assigned a case worker to view referrals.'),
    ).toBeTruthy()
  })

  it('renders spinner while referrals are loading', () => {
    useGetAllCompanyReferralsMock.mockReturnValue({
      isLoading: true,
      referrals: [],
    })

    render(
      <WorkerReferralTable caseWorkerId="worker-1" companyId={4} columns={columns} />,
    )

    expect(screen.getByTestId('spinner')).toBeTruthy()
  })

  it('shows empty table state when no referrals are returned', () => {
    useGetAllCompanyReferralsMock.mockReturnValue({
      isLoading: false,
      referrals: [],
    })

    render(
      <WorkerReferralTable caseWorkerId="worker-1" companyId={4} columns={columns} />,
    )

    expect(screen.getByText('No results.')).toBeTruthy()
    expect(useGetAllCompanyReferralsMock).toHaveBeenCalledWith({ companyId: 4 })
  })

  it('opens assign dialog when a referral row is clicked', () => {
    useGetAllCompanyReferralsMock.mockReturnValue({
      isLoading: false,
      referrals: [{ id: 'ref-2', name: 'Referral 2' }],
    })

    render(
      <WorkerReferralTable caseWorkerId="worker-1" companyId={4} columns={columns} />,
    )

    fireEvent.click(screen.getByText('Referral 2'))

    expect(screen.getByText('assign:ref-2')).toBeTruthy()
  })
})

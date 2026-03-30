import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CompanyList } from '@/components/companyList/CompanyList'

const { useGetCompanyListMock } = vi.hoisted(() => ({
  useGetCompanyListMock: vi.fn(),
}))

vi.mock('@/hooks/company/useGetCompanyList', () => ({
  useGetCompanyList: (...args: unknown[]) => useGetCompanyListMock(...args),
}))

vi.mock('@/components/companyList/CompanyCard', () => ({
  CompanyCard: ({ company }: { company: { name: string } }) => (
    <div data-testid="company-card">{company.name}</div>
  ),
}))

describe('CompanyList', () => {
  it('shows loading state', () => {
    useGetCompanyListMock.mockReturnValue({
      companyList: [],
      error: null,
      isError: false,
      isLoading: true,
    })

    render(<CompanyList userId="user-1" />)

    expect(screen.getByText('Find and join your provider')).toBeTruthy()
  })

  it('renders company cards when list exists', () => {
    useGetCompanyListMock.mockReturnValue({
      companyList: [
        { id: '1', name: 'Alpha', city: 'A', country: 'NZ' },
        { id: '2', name: 'Beta', city: 'B', country: 'NZ' },
      ],
      error: null,
      isError: false,
      isLoading: false,
    })

    render(<CompanyList userId="user-1" />)

    expect(screen.getAllByTestId('company-card').length).toBe(2)
    expect(screen.getByText('Alpha')).toBeTruthy()
    expect(screen.getByText('Beta')).toBeTruthy()
  })

  it('shows empty state when no companies are available', () => {
    useGetCompanyListMock.mockReturnValue({
      companyList: [],
      error: null,
      isError: false,
      isLoading: false,
    })

    render(<CompanyList userId="user-1" />)

    expect(screen.getByText(/No companies available yet/)).toBeTruthy()
  })
})

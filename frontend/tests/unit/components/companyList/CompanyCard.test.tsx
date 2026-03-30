import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CompanyCard } from '@/components/companyList/CompanyCard'

vi.mock('framer-motion', () => ({
  motion: {
    button: ({ children, whileHover, variants, transition, ...props }: any) => (
      <button {...props}>{children}</button>
    ),
    h3: ({ children, initial, variants, transition, ...props }: any) => (
      <h3 {...props}>{children}</h3>
    ),
  },
}))

vi.mock('@/components/modal/SpringModal', () => ({
  SpringModal: ({ isOpen }: { isOpen: boolean }) => (
    <div data-testid="spring-modal-state">{isOpen ? 'open' : 'closed'}</div>
  ),
}))

describe('CompanyCard', () => {
  it('renders company details', () => {
    render(
      <CompanyCard
        userId="user-1"
        company={{
          id: 'c1',
          name: 'Test Company',
          city: 'Auckland',
          country: 'NZ',
        } as any}
      />,
    )

    expect(screen.getByText('Test Company')).toBeTruthy()
    expect(screen.getByText(/Auckland, NZ/)).toBeTruthy()
    expect(screen.getByTestId('spring-modal-state').textContent).toBe('closed')
  })

  it('opens modal when card is clicked', () => {
    render(
      <CompanyCard
        userId="user-1"
        company={{
          id: 'c2',
          name: 'Open Modal Co',
          city: 'Wellington',
          country: 'NZ',
        } as any}
      />,
    )

    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByTestId('spring-modal-state').textContent).toBe('open')
  })
})

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ApplicationView } from '@/components/dashboard/UserApplicationViewDashboard'

vi.mock('@/components/profile/card/applicationCard/ApplicationCard', () => ({
  ApplicationCard: ({ userId }: { userId: string }) => (
    <div data-testid="application-card">application:{userId}</div>
  ),
}))

describe('ApplicationView', () => {
  it('passes userId to ApplicationCard', () => {
    render(<ApplicationView userId="user-42" />)

    expect(screen.getByText('application:user-42')).toBeTruthy()
  })
})

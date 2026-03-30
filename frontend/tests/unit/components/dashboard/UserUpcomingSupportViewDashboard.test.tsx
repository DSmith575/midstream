import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { UserUpcomingSupportViewDashboard } from '@/components/dashboard/UserUpcomingSupportViewDashboard'

vi.mock('@/components/profile/card/upcomingSupport/UpcomingSupportCard', () => ({
  UpcomingSupportCard: ({ userId }: { userId: string }) => (
    <div data-testid="upcoming-support-card">upcoming-support:{userId}</div>
  ),
}))

describe('UserUpcomingSupportViewDashboard', () => {
  it('passes userId to UpcomingSupportCard', () => {
    render(<UserUpcomingSupportViewDashboard userId="user-42" />)

    expect(screen.getByText('upcoming-support:user-42')).toBeTruthy()
  })
})

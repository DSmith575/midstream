import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SupportFolderView } from '@/components/dashboard/UserSupportFolderViewDashboard'

vi.mock('@/components/profile/card/support/SupportFolderCard', () => ({
  SupportFolderCard: ({ userId }: { userId: string }) => (
    <div data-testid="support-folder-card">support-folder:{userId}</div>
  ),
}))

describe('SupportFolderView', () => {
  it('passes userId to SupportFolderCard', () => {
    render(<SupportFolderView userId="user-42" />)

    expect(screen.getByText('support-folder:user-42')).toBeTruthy()
  })
})

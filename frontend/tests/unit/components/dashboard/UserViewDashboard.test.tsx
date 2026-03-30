import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { UserView } from '@/components/dashboard/UserViewDashboard'

const { useUserProfileMock } = vi.hoisted(() => ({
  useUserProfileMock: vi.fn(),
}))

vi.mock('@/hooks/userProfile/useUserProfile', () => ({
  useUserProfile: (...args: unknown[]) => useUserProfileMock(...args),
}))

vi.mock('@/components/spinner', () => ({
  Spinner: () => <div data-testid="spinner">loading</div>,
}))

vi.mock('@/components/profile/card/userCard/UserProfileCard', () => ({
  UserProfileCard: ({ userProfile }: { userProfile: { personalInformation: { firstName: string } } }) => (
    <div data-testid="user-profile-card">profile:{userProfile.personalInformation.firstName}</div>
  ),
}))

describe('UserView', () => {
  it('shows spinner while loading', () => {
    useUserProfileMock.mockReturnValue({
      userData: null,
      error: null,
      isLoading: true,
    })

    render(<UserView userId="u1" />)
    expect(screen.getByTestId('spinner')).toBeTruthy()
  })

  it('shows error state when request fails', () => {
    useUserProfileMock.mockReturnValue({
      userData: null,
      error: new Error('failed'),
      isLoading: false,
    })

    render(<UserView userId="u1" />)
    expect(screen.getByText('Error loading user.')).toBeTruthy()
  })

  it('shows empty state when user data does not exist', () => {
    useUserProfileMock.mockReturnValue({
      userData: null,
      error: null,
      isLoading: false,
    })

    render(<UserView userId="u1" />)
    expect(screen.getByText('No user data found.')).toBeTruthy()
  })

  it('renders profile card when user data exists', () => {
    useUserProfileMock.mockReturnValue({
      userData: {
        personalInformation: { firstName: 'Jane' },
      },
      error: null,
      isLoading: false,
    })

    render(<UserView userId="u1" />)
    expect(screen.getByText('profile:Jane')).toBeTruthy()
  })
})

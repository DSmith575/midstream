import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { DashboardContent } from '@/components/dashboard/DashboardContent'

const { useUserProfileMock } = vi.hoisted(() => ({
  useUserProfileMock: vi.fn(),
}))

vi.mock('@/hooks/userProfile/useUserProfile', () => ({
  useUserProfile: (...args: unknown[]) => useUserProfileMock(...args),
}))

vi.mock('@/components/spinner', () => ({
  Spinner: () => <div data-testid="spinner">loading</div>,
}))

vi.mock('@/components/forms/profileForm/ProfileForm', () => ({
  ProfileForm: () => <div data-testid="profile-form">profile-form</div>,
}))

vi.mock('@/components/companyList/CompanyList', () => ({
  CompanyList: ({ userId }: { userId: string }) => (
    <div data-testid="company-list">company-list:{userId}</div>
  ),
}))

vi.mock('@/components/sidebar', () => ({
  SIDEBAR_VIEWS: {
    user: {
      label: 'User',
      component: ({ userId }: { userId: string }) => (
        <div data-testid="dashboard-view">view-user:{userId}</div>
      ),
    },
  },
  SidebarApp: ({ userName }: { userName: string }) => (
    <div data-testid="sidebar-app">sidebar-app:{userName}</div>
  ),
  SidebarSiteHeader: ({ selectedView }: { selectedView: string }) => (
    <div data-testid="sidebar-header">header:{selectedView}</div>
  ),
  SidebarWrapper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-wrapper">{children}</div>
  ),
}))

vi.mock('@/components/ui/sidebar', () => ({
  SidebarInset: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-inset">{children}</div>
  ),
}))

describe('DashboardContent', () => {
  it('renders error state when profile request fails', () => {
    useUserProfileMock.mockReturnValue({
      userData: null,
      error: new Error('boom'),
      isLoading: false,
    })

    render(<DashboardContent userId="user-1" />)

    expect(screen.getByText('An error has occurred.')).toBeTruthy()
    expect(screen.getByText('Please try again later')).toBeTruthy()
  })

  it('renders spinner while loading', () => {
    useUserProfileMock.mockReturnValue({
      userData: null,
      error: null,
      isLoading: true,
    })

    render(<DashboardContent userId="user-1" />)

    expect(screen.getByTestId('spinner')).toBeTruthy()
  })

  it('renders profile form when no profile exists', () => {
    useUserProfileMock.mockReturnValue({
      userData: null,
      error: null,
      isLoading: false,
    })

    render(<DashboardContent userId="user-1" />)

    expect(screen.getByTestId('profile-form')).toBeTruthy()
  })

  it('renders company list for clients missing company', () => {
    useUserProfileMock.mockReturnValue({
      userData: {
        role: 'CLIENT',
        company: null,
        addressInformation: { city: 'Auckland' },
      },
      error: null,
      isLoading: false,
    })

    render(<DashboardContent userId="user-1" />)

    expect(screen.getByText('company-list:user-1')).toBeTruthy()
  })

  it('renders sidebar layout for client with company', () => {
    useUserProfileMock.mockReturnValue({
      userData: {
        role: 'CLIENT',
        company: { id: 5, name: 'Acme Support' },
        addressInformation: { city: 'Auckland' },
        personalInformation: { firstName: 'Jane', lastName: 'Doe' },
      },
      error: null,
      isLoading: false,
    })

    render(<DashboardContent userId="user-1" />)

    expect(screen.getByText('sidebar-app:Jane Doe')).toBeTruthy()
    expect(screen.getByText('header:User')).toBeTruthy()
    expect(screen.getByText('view-user:user-1')).toBeTruthy()
  })
})

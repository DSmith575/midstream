import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { MotionContainer } from '@/components/animation/MotionContainer'

const { motionDivMock } = vi.hoisted(() => ({
  motionDivMock: vi.fn(({ children, ...props }: any) => <div {...props}>{children}</div>),
}))

vi.mock('framer-motion', () => ({
  motion: {
    div: motionDivMock,
  },
}))

describe('MotionContainer', () => {
  it('renders content and sets right-side initial animation for positive delta', () => {
    render(
      <MotionContainer delta={50} header="Profile" subtitle="Details">
        <div>Child block</div>
      </MotionContainer>,
    )

    expect(motionDivMock).toHaveBeenCalledTimes(1)
    const motionProps = motionDivMock.mock.calls[0][0]
    expect(motionProps.initial).toMatchObject({ x: '50%', opacity: 0 })
    expect(motionProps.animate).toMatchObject({ x: 0, opacity: 1 })
    expect(motionProps.transition).toMatchObject({
      duration: 0.3,
      ease: 'easeInOut',
    })

    expect(screen.getByText('Profile')).toBeTruthy()
    expect(screen.getByText('Details')).toBeTruthy()
    expect(screen.getByText('Child block')).toBeTruthy()
  })

  it('sets left-side initial animation for negative delta', () => {
    render(
      <MotionContainer delta={-10} header="Left" subtitle="Slide in from left">
        <div>Item</div>
      </MotionContainer>,
    )

    const motionProps = motionDivMock.mock.calls[motionDivMock.mock.calls.length - 1][0]
    expect(motionProps.initial).toMatchObject({ x: '-50%', opacity: 0 })
  })
})

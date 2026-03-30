import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Reveal } from '@/components/animation/Reveal'

const { mainStartMock, slideStartMock, useInViewMock, motionDivMock, useAnimationMock } = vi.hoisted(() => {
  const mainStart = vi.fn()
  const slideStart = vi.fn()
  const useInView = vi.fn(() => true)
  const motionDiv = vi.fn(({ children, ...props }: any) => <div {...props}>{children}</div>)

  let callCount = 0
  const useAnimation = vi.fn(() => {
    const controller = callCount % 2 === 0 ? { start: mainStart } : { start: slideStart }
    callCount += 1
    return controller
  })
  const resetCallCount = () => {
    callCount = 0
  }

  ;(useAnimation as any).__resetCallCount = resetCallCount

  return {
    mainStartMock: mainStart,
    slideStartMock: slideStart,
    useInViewMock: useInView,
    motionDivMock: motionDiv,
    useAnimationMock: useAnimation,
  }
})

vi.mock('framer-motion', () => ({
  motion: {
    div: motionDivMock,
  },
  useAnimation: useAnimationMock,
  useInView: useInViewMock,
}))

describe('Reveal', () => {
  beforeEach(() => {
    ;(useAnimationMock as any).__resetCallCount()
    mainStartMock.mockClear()
    slideStartMock.mockClear()
    useInViewMock.mockClear()
    motionDivMock.mockClear()
  })

  it('does not start animations when element is not in view', () => {
    useInViewMock.mockReturnValueOnce(false)

    render(
      <Reveal>
        <span>Hidden</span>
      </Reveal>,
    )

    expect(mainStartMock).not.toHaveBeenCalledWith('visible')
    expect(slideStartMock).not.toHaveBeenCalledWith('visible')
  })

  it('renders child content and runs reveal animation controls', () => {
    useInViewMock.mockReturnValueOnce(true)

    render(
      <Reveal>
        <span>Animated text</span>
      </Reveal>,
    )

    expect(screen.getByText('Animated text')).toBeTruthy()
    expect(mainStartMock).toHaveBeenCalledWith('visible')
    expect(slideStartMock).toHaveBeenCalledWith('visible')
  })

  it('applies provided width style to container', () => {
    useInViewMock.mockReturnValueOnce(true)

    const { container } = render(
      <Reveal width="100%">
        <span>Wide</span>
      </Reveal>,
    )

    const root = container.firstElementChild as HTMLElement
    expect(root).toBeTruthy()
    expect(root.style.width).toBe('100%')
  })
})

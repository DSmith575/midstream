import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Block } from '@/components/animation/Block'

const { motionDivMock } = vi.hoisted(() => ({
  motionDivMock: vi.fn(({ children, ...props }: any) => <div {...props}>{children}</div>),
}))

vi.mock('framer-motion', () => ({
  motion: {
    div: motionDivMock,
  },
}))

describe('Block', () => {
  it('applies expected animation config and forwards props', () => {
    const onClick = vi.fn()

    render(
      <Block className="custom-class" data-testid="block-test" onClick={onClick}>
        Content
      </Block>,
    )

    expect(motionDivMock).toHaveBeenCalledTimes(1)
    const motionProps = motionDivMock.mock.calls[0][0]
    expect(motionProps.initial).toBe('initial')
    expect(motionProps.animate).toBe('animate')
    expect(motionProps.variants.initial).toMatchObject({
      scale: 0.9,
      y: 20,
      opacity: 0,
    })
    expect(motionProps.variants.animate).toMatchObject({
      scale: 1,
      y: 0,
      opacity: 1,
    })
    expect(motionProps.transition).toMatchObject({
      type: 'spring',
      mass: 2,
      stiffness: 200,
      damping: 30,
    })

    const block = screen.getByTestId('block-test')
    expect(block.className).toContain('rounded-2xl')
    expect(block.className).toContain('custom-class')
    expect(screen.getByText('Content')).toBeTruthy()

    block.click()
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})

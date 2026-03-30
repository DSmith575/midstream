import { describe, expect, it } from 'vitest'

import { Block, MotionContainer, Reveal } from '@/components/animation'

describe('animation index exports', () => {
  it('exports Block, MotionContainer, and Reveal', () => {
    expect(Block).toBeTruthy()
    expect(MotionContainer).toBeTruthy()
    expect(Reveal).toBeTruthy()
  })
})

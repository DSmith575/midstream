import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CaseStatSection } from '@/components/card/caseStat/CaseStat'

describe('CaseStatSection', () => {
  it('renders provided case counts', () => {
    render(<CaseStatSection casesCompleted={8} casesAssigned={12} />)

    expect(screen.getByText('Cases Completed')).toBeTruthy()
    expect(screen.getByText('Cases Assigned')).toBeTruthy()
    expect(screen.getByText('8')).toBeTruthy()
    expect(screen.getByText('12')).toBeTruthy()
  })

  it('renders fallback dash for missing values', () => {
    render(<CaseStatSection />)

    const dashes = screen.getAllByText('—')
    expect(dashes.length).toBe(2)
  })

  it('renders zero values as numbers, not fallback dash', () => {
    render(<CaseStatSection casesCompleted={0} casesAssigned={0} />)

    const zeros = screen.getAllByText('0')
    expect(zeros.length).toBe(2)
    expect(screen.queryByText('—')).toBeNull()
  })
})

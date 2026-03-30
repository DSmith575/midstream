import { describe, expect, it } from 'vitest'

import { CompanyCard, CompanyList } from '@/components/companyList'

describe('companyList index exports', () => {
  it('exports CompanyCard and CompanyList', () => {
    expect(CompanyCard).toBeTruthy()
    expect(CompanyList).toBeTruthy()
  })
})

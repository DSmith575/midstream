import { describe, expect, it } from 'vitest'

export const runImportSmokeSuite = (
  suiteName: string,
  modules: Record<string, () => Promise<unknown>>,
) => {
  const entries = Object.entries(modules).sort(([a], [b]) => a.localeCompare(b))

  describe(suiteName, () => {
    it('has files to validate', () => {
      expect(entries.length).toBeGreaterThan(0)
    })

    for (const [filePath, loadModule] of entries) {
      it(`imports ${filePath}`, async () => {
        await expect(loadModule()).resolves.toBeDefined()
      })
    }
  })
}

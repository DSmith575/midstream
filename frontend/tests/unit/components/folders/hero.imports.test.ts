import { runImportSmokeSuite } from '../../smoke/runImportSmokeSuite'

const modules = import.meta.glob('/src/components/hero/**/*.{ts,tsx}')

runImportSmokeSuite('components/hero import smoke', modules)

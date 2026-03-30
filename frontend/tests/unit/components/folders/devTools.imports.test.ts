import { runImportSmokeSuite } from '../../smoke/runImportSmokeSuite'

const modules = import.meta.glob('/src/components/devTools/**/*.{ts,tsx}')

runImportSmokeSuite('components/devTools import smoke', modules)

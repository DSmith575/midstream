import { runImportSmokeSuite } from '../../smoke/runImportSmokeSuite'

const modules = import.meta.glob('/src/components/modal/**/*.{ts,tsx}')

runImportSmokeSuite('components/modal import smoke', modules)

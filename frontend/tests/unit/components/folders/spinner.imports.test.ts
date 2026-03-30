import { runImportSmokeSuite } from '../../smoke/runImportSmokeSuite'

const modules = import.meta.glob('/src/components/spinner/**/*.{ts,tsx}')

runImportSmokeSuite('components/spinner import smoke', modules)

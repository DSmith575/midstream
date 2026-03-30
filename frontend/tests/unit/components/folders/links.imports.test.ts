import { runImportSmokeSuite } from '../../smoke/runImportSmokeSuite'

const modules = import.meta.glob('/src/components/links/**/*.{ts,tsx}')

runImportSmokeSuite('components/links import smoke', modules)

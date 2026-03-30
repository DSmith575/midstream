import { runImportSmokeSuite } from '../../smoke/runImportSmokeSuite'

const modules = import.meta.glob('/src/components/text/**/*.{ts,tsx}')

runImportSmokeSuite('components/text import smoke', modules)

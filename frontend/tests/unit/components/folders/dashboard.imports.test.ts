import { runImportSmokeSuite } from '../../smoke/runImportSmokeSuite'

const modules = import.meta.glob('/src/components/dashboard/**/*.{ts,tsx}')

runImportSmokeSuite('components/dashboard import smoke', modules)

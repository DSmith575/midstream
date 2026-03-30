import { runImportSmokeSuite } from '../../smoke/runImportSmokeSuite'

const modules = import.meta.glob('/src/components/profile/**/*.{ts,tsx}')

runImportSmokeSuite('components/profile import smoke', modules)

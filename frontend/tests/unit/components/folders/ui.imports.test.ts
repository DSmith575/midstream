import { runImportSmokeSuite } from '../../smoke/runImportSmokeSuite'

const modules = import.meta.glob('/src/components/ui/**/*.{ts,tsx}')

runImportSmokeSuite('components/ui import smoke', modules)

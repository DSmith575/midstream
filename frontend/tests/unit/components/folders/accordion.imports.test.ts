import { runImportSmokeSuite } from '../../smoke/runImportSmokeSuite'

const modules = import.meta.glob('/src/components/accordion/**/*.{ts,tsx}')

runImportSmokeSuite('components/accordion import smoke', modules)
